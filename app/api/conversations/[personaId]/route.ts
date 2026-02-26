import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { generateConversationResponse, type SessionContext } from "@/lib/ai/conversation"
import {
  CBT_FRAMEWORK_TYPE,
  isCBTTherapist,
  extractAdvanceSignal,
  getNextPhase,
  type CBTPhase,
  type CBTCollectedData,
} from "@/lib/ai/cbt-framework"
import {
  PSYCHOANALYTIC_FRAMEWORK_TYPE,
  isPsychoAnalyst,
  getNextPsychoPhase,
  type PsychoPhase,
} from "@/lib/ai/psychoanalytic-framework"
import { ai, DEFAULT_MODEL } from "@/lib/ai/client"

// --- helpers -----------------------------------------------------------------

async function getUserPersona(userId: string, username: string) {
  let persona = await prisma.persona.findFirst({ where: { creatorUserId: userId } })
  if (!persona) {
    persona = await prisma.persona.create({
      data: {
        name: username,
        username,
        bio: "Human user",
        personalityTraits: {},
        isSystemGenerated: false,
        creatorUserId: userId,
      },
    })
  }
  return persona
}

async function getOrCreateSessionState(
  conversationId: string,
  userId: string,
  personaId: string,
  personaUsername: string
) {
  const existing = await prisma.sessionState.findUnique({ where: { conversationId } })
  if (existing) return existing

  let frameworkType = 'free'
  let currentPhase = 'free'

  if (isCBTTherapist(personaUsername)) {
    frameworkType = CBT_FRAMEWORK_TYPE
    currentPhase = 'intake'
  } else if (isPsychoAnalyst(personaUsername)) {
    frameworkType = PSYCHOANALYTIC_FRAMEWORK_TYPE
    currentPhase = 'opening'
  }

  return prisma.sessionState.create({
    data: {
      conversationId,
      userId,
      personaId,
      frameworkType,
      currentPhase,
      collectedData: {},
    },
  })
}

// --- Opening message prompts -------------------------------------------------

const OPENING_PROMPTS: Record<string, string> = {
  dr_rachel_cbt: `You are Dr. Rachel Kim, a CBT therapist. A new client has just opened a conversation with you for the first time.

Write a warm, professional opening message that:
- Introduces yourself briefly and naturally (1 sentence)
- Acknowledges that reaching out takes courage
- Invites them to share what's brought them here today
- Feels human and unhurried, not clinical or scripted

Keep it to 3-4 sentences. Do not mention CBT or thought records yet -- just open the door.`,

  dr_sarah_heals: `You are Dr. Sarah Holloway, a trauma counsellor. A new client has just opened a conversation with you for the first time.

Write a warm, safe opening message that:
- Introduces yourself gently
- Emphasises that this is a safe, non-judgmental space
- Lets them know they can share as much or as little as they like
- Invites them to start wherever feels comfortable

Keep it to 3-4 sentences. Go slowly -- safety first.`,

  dr_james_grief: `You are Dr. James Whitfield, a grief counsellor. A new client has just opened a conversation with you for the first time.

Write a gentle, unhurried opening message that:
- Introduces yourself with warmth
- Acknowledges that coming here may not have been easy
- Creates space without pressure -- they don't have to say anything they're not ready to
- Invites them to share whatever feels right

Keep it to 3-4 sentences. Be present, not procedural.`,

  dr_priya_anxiety: `You are Dr. Priya Sharma, an anxiety and stress specialist. A new client has just opened a conversation with you for the first time.

Write a calm, grounding opening message that:
- Introduces yourself
- Normalises the fact that they're here -- reaching out is already a positive step
- Reassures them that whatever they're experiencing, you've heard it before and they won't be judged
- Invites them to tell you what's been going on

Keep it to 3-4 sentences. Your tone should be calming from the first word.`,

  dr_marcus_depression: `You are Dr. Marcus Webb, a depression specialist. A new client has just opened a conversation with you for the first time.

Write a hopeful, gentle opening message that:
- Introduces yourself
- Acknowledges that getting here when things feel hard is genuinely meaningful
- Reassures them there's no pressure to have the right words
- Invites them to share whatever feels manageable right now

Keep it to 3-4 sentences. Hold hope on their behalf from the start.`,

  dr_olivia_relate: `You are Dr. Olivia Stone, a relationship therapist. A new client has just opened a conversation with you for the first time.

Write a warm, balanced opening message that:
- Introduces yourself
- Acknowledges that relationship difficulties can feel isolating
- Makes clear this is a non-judgmental space -- there's no "right" way to describe what's happening
- Invites them to share what's brought them here

Keep it to 3-4 sentences. Be warm but not overly effusive.`,

  dr_viktor_psych: `You are Dr. Viktor Adler, a psychoanalyst. A new patient has just opened a conversation with you for the first time.

Write a brief, measured opening that establishes the analytic space. It should:
- Introduce yourself simply (one short sentence, no credentials)
- Establish the fundamental rule of free association -- that the patient should say whatever comes to mind, without censorship or selection
- Create space without pressure or warmth that would feel false
- Leave silence for them to enter

Keep it to 2-3 sentences. The tone is quiet, unhurried, and containing -- like a room waiting to be entered. Do not offer warmth or reassurance. Do not express enthusiasm. Simply open the space.`,
}

const GENERIC_OPENING_PROMPT = (name: string) =>
  `You are ${name}. A new user has just started a conversation with you.
Write a friendly, natural opening message -- as if you've just received a message notification and you're saying hello. Keep it to 1-2 sentences, warm and casual.`

async function generateOpeningMessage(
  personaId: string,
  personaUsername: string,
  personaName: string,
  conversationId: string,
  receiverPersonaId: string
): Promise<void> {
  const prompt = OPENING_PROMPTS[personaUsername] ?? GENERIC_OPENING_PROMPT(personaName)

  const response = await ai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 200,
    temperature: 0.8,
  })

  const content = response.choices[0]?.message?.content?.trim()
  if (!content) return

  await prisma.message.create({
    data: {
      conversationId,
      content,
      senderPersonaId: personaId,
      receiverPersonaId,
      isRead: false,
    },
  })
}

// --- GET ---------------------------------------------------------------------

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ personaId: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { personaId } = await params
    const userPersona = await getUserPersona(user.id, user.username)

    const aiPersona = await prisma.persona.findUnique({
      where: { id: personaId },
      select: { id: true, name: true, username: true, avatarUrl: true, bio: true },
    })
    if (!aiPersona) return NextResponse.json({ error: "Persona not found" }, { status: 404 })

    const conversationId = [userPersona.id, personaId].sort().join('-')

    // Create session state first (determines framework)
    const sessionState = await getOrCreateSessionState(
      conversationId,
      user.id,
      personaId,
      aiPersona.username
    )

    // Generate opening message if brand new conversation
    const existingCount = await prisma.message.count({ where: { conversationId } })
    if (existingCount === 0) {
      console.log(`Generating opening message from ${aiPersona.name}...`)
      await generateOpeningMessage(
        personaId,
        aiPersona.username,
        aiPersona.name,
        conversationId,
        userPersona.id
      )
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, username: true, avatarUrl: true } },
      },
    })

    await prisma.message.updateMany({
      where: { conversationId, receiverPersonaId: userPersona.id, isRead: false },
      data: { isRead: true },
    })

    return NextResponse.json({
      persona: aiPersona,
      messages,
      conversationId,
      userPersonaId: userPersona.id,
      sessionState: {
        frameworkType: sessionState.frameworkType,
        currentPhase: sessionState.currentPhase,
        collectedData: sessionState.collectedData,
        completedAt: sessionState.completedAt,
      },
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

// --- POST --------------------------------------------------------------------

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ personaId: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { personaId } = await params
    const body = await req.json()
    const { content } = body

    if (!content?.trim()) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 })
    }

    const userPersona = await getUserPersona(user.id, user.username)
    const aiPersona = await prisma.persona.findUnique({ where: { id: personaId } })
    if (!aiPersona) return NextResponse.json({ error: "Persona not found" }, { status: 404 })

    const conversationId = [userPersona.id, personaId].sort().join('-')

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        conversationId,
        content,
        senderPersonaId: userPersona.id,
        receiverPersonaId: personaId,
        isRead: true,
      },
    })

    // Load recent history
    const recentMessages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: 12,
    })
    const conversationHistory = recentMessages.reverse().map(msg => ({
      role: msg.senderPersonaId === userPersona.id ? 'user' as const : 'assistant' as const,
      content: msg.content,
    }))

    // Load session state
    const sessionState = await getOrCreateSessionState(
      conversationId,
      user.id,
      personaId,
      aiPersona.username
    )

    // Build session context
    let sessionContext: SessionContext | undefined

    if (sessionState.frameworkType === CBT_FRAMEWORK_TYPE && sessionState.currentPhase !== 'free') {
      sessionContext = {
        frameworkType: sessionState.frameworkType,
        currentPhase: sessionState.currentPhase as CBTPhase,
        collectedData: (sessionState.collectedData ?? {}) as CBTCollectedData,
      }
    } else if (sessionState.frameworkType === PSYCHOANALYTIC_FRAMEWORK_TYPE) {
      sessionContext = {
        frameworkType: sessionState.frameworkType,
        currentPhase: sessionState.currentPhase as PsychoPhase,
        collectedData: {},
      }
    }

    // Generate AI response
    const rawAiResponse = await generateConversationResponse(
      {
        name: aiPersona.name,
        username: aiPersona.username,
        bio: aiPersona.bio || '',
        personalityTraits: aiPersona.personalityTraits as any,
      },
      conversationHistory,
      sessionContext
    )

    // Process [ADVANCE] signal
    const { content: cleanResponse, shouldAdvance } = extractAdvanceSignal(rawAiResponse)

    // Update session state if advancing
    let updatedPhase: string = sessionState.currentPhase
    let completedAt = sessionState.completedAt

    if (shouldAdvance) {
      if (sessionState.frameworkType === CBT_FRAMEWORK_TYPE) {
        const nextPhase = getNextPhase(sessionState.currentPhase as CBTPhase)
        updatedPhase = nextPhase
        console.log(`CBT session advancing: ${sessionState.currentPhase} -> ${nextPhase}`)
        if (nextPhase === 'complete' && !completedAt) completedAt = new Date()
      } else if (sessionState.frameworkType === PSYCHOANALYTIC_FRAMEWORK_TYPE) {
        const nextPhase = getNextPsychoPhase(sessionState.currentPhase as PsychoPhase)
        updatedPhase = nextPhase
        console.log(`Psychoanalytic session advancing: ${sessionState.currentPhase} -> ${nextPhase}`)
        if (nextPhase === 'closing' && !completedAt) completedAt = new Date()
      }

      await prisma.sessionState.update({
        where: { conversationId },
        data: {
          currentPhase: updatedPhase,
          completedAt,
        },
      })
    }

    // Save AI message
    const aiMessage = await prisma.message.create({
      data: {
        conversationId,
        content: cleanResponse,
        senderPersonaId: personaId,
        receiverPersonaId: userPersona.id,
        isRead: false,
      },
      include: {
        sender: { select: { id: true, name: true, username: true, avatarUrl: true } },
      },
    })

    return NextResponse.json({
      userMessage,
      aiMessage,
      sessionState: {
        frameworkType: sessionState.frameworkType,
        currentPhase: updatedPhase,
        collectedData: sessionState.collectedData,
        completedAt,
        didAdvance: shouldAdvance,
      },
    })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json(
      { error: "Failed to send message", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
