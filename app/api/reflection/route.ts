import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { ai, DEFAULT_MODEL } from "@/lib/ai/client"

// Therapist usernames — used to identify which conversations are therapeutic
const THERAPIST_USERNAMES = new Set([
  'dr_sarah_heals',
  'dr_james_grief',
  'dr_rachel_cbt',
  'dr_priya_anxiety',
  'dr_marcus_depression',
  'dr_olivia_relate',
  'dr_viktor_psych',
])

const THERAPIST_LABELS: Record<string, string> = {
  dr_sarah_heals:       'Dr. Sarah Holloway (Trauma)',
  dr_james_grief:       'Dr. James Whitfield (Grief)',
  dr_rachel_cbt:        'Dr. Rachel Kim (CBT)',
  dr_priya_anxiety:     'Dr. Priya Sharma (Anxiety)',
  dr_marcus_depression: 'Dr. Marcus Webb (Depression)',
  dr_olivia_relate:     'Dr. Olivia Stone (Relationships)',
  dr_viktor_psych:      'Dr. Viktor Adler (Psychoanalysis)',
}

// How often to auto-regenerate (7 days)
const REGEN_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000

// Minimum messages needed before generating a reflection
const MIN_MESSAGES = 6

interface ReflectionData {
  summary: string
  themes: string[]
  reflectionQ: string
}

async function generateReflection(
  conversationBlocks: { therapist: string; messages: { role: string; content: string }[] }[]
): Promise<ReflectionData> {

  const totalMessages = conversationBlocks.reduce((n, b) => n + b.messages.length, 0)

  // Format conversation history for the prompt
  const transcriptSection = conversationBlocks.map(block => {
    const lines = block.messages.map(m =>
      `${m.role === 'user' ? 'Patient' : block.therapist}: ${m.content}`
    ).join('\n')
    return `--- Sessions with ${block.therapist} ---\n${lines}`
  }).join('\n\n')

  const prompt = `You are a compassionate, insightful clinical observer reviewing excerpts from a person's therapeutic conversations. Your task is to write a warm, personal reflection of their journey so far — not as a therapist giving feedback, but as a thoughtful mirror that helps them see what they've been working through.

Here are the conversation excerpts:

${transcriptSection}

Based on these conversations, produce a JSON object with exactly this structure:
{
  "summary": "A 2-4 sentence personal narrative written in second person ('You've been...', 'There's a thread running through...', 'Something you keep returning to...'). Warm, honest, and grounded in what actually appears in the conversations. Do not be generic or clinical. Reflect specific themes, feelings, or patterns you genuinely observe. Do not offer advice or encouragement -- just reflect back what you see with care.",
  "themes": ["theme1", "theme2", "theme3", "theme4"],
  "reflectionQ": "A single open, gentle question that invites the person to sit with something meaningful from their conversations. Not a directive. Something they could genuinely reflect on. E.g. 'What would it feel like to...' or 'When you think about X, what comes up for you?'"
}

For themes: identify 3-5 short phrases (2-4 words each) that genuinely capture recurring subjects, feelings, or patterns in these conversations. Examples: 'family expectations', 'fear of abandonment', 'self-worth at work', 'grief and identity', 'anxiety about the future'. Be specific to what actually appears -- not generic mental health labels.

Return only the JSON object, no preamble, no markdown backticks.`

  const response = await ai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 600,
    temperature: 0.75,
  })

  const raw = response.choices[0]?.message?.content?.trim() ?? ''

  // Strip any accidental markdown fences
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()

  const parsed = JSON.parse(cleaned) as ReflectionData
  return parsed
}

// GET -- return current reflection (or generate if missing/stale)
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const forceRefresh = req.nextUrl.searchParams.get('refresh') === 'true'

    // Check existing reflection
    const existing = await prisma.userReflection.findUnique({
      where: { userId: user.id }
    })

    const isStale = !existing ||
      (Date.now() - new Date(existing.generatedAt).getTime() > REGEN_INTERVAL_MS)

    if (existing && !isStale && !forceRefresh) {
      return NextResponse.json({ reflection: existing, fresh: false })
    }

    // Get user's persona to find conversations
    const userPersona = await prisma.persona.findFirst({
      where: { creatorUserId: user.id }
    })
    if (!userPersona) {
      return NextResponse.json({ reflection: null, reason: 'no_persona' })
    }

    // Get all therapist personas
    const therapistPersonas = await prisma.persona.findMany({
      where: {
        username: { in: Array.from(THERAPIST_USERNAMES) }
      },
      select: { id: true, username: true }
    })

    // Gather messages from each therapist conversation
    const conversationBlocks: { therapist: string; messages: { role: string; content: string }[] }[] = []
    let totalUserMessages = 0

    for (const therapist of therapistPersonas) {
      const conversationId = [userPersona.id, therapist.id].sort().join('-')

      const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        take: 60,  // last 60 messages per therapist
        select: { content: true, senderPersonaId: true }
      })

      if (messages.length < 2) continue  // skip empty conversations

      const userMsgCount = messages.filter(m => m.senderPersonaId === userPersona.id).length
      if (userMsgCount < 2) continue  // skip if user barely spoke

      totalUserMessages += userMsgCount

      conversationBlocks.push({
        therapist: THERAPIST_LABELS[therapist.username] ?? therapist.username,
        messages: messages.map(m => ({
          role: m.senderPersonaId === userPersona.id ? 'user' : 'assistant',
          content: m.content
        }))
      })
    }

    // Not enough material yet
    if (totalUserMessages < MIN_MESSAGES) {
      return NextResponse.json({ reflection: null, reason: 'not_enough_data' })
    }

    // Generate the reflection
    const reflectionData = await generateReflection(conversationBlocks)

    // Upsert into DB
    const savedReflection = await prisma.userReflection.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        summary: reflectionData.summary,
        themes: reflectionData.themes,
        reflectionQ: reflectionData.reflectionQ,
        messageCount: totalUserMessages,
      },
      update: {
        summary: reflectionData.summary,
        themes: reflectionData.themes,
        reflectionQ: reflectionData.reflectionQ,
        messageCount: totalUserMessages,
        generatedAt: new Date(),
      }
    })

    return NextResponse.json({ reflection: savedReflection, fresh: true })

  } catch (error) {
    console.error('Error generating reflection:', error)
    return NextResponse.json(
      { error: 'Failed to generate reflection', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
