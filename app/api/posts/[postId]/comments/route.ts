import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { ai, DEFAULT_MODEL } from "@/lib/ai"

// Generate comments for a post
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params

    // Get the post with persona info
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        persona: {
          select: {
            id: true,
            name: true,
            username: true
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Get 2-3 random personas (not the post author)
    const allPersonas = await prisma.persona.findMany({
      where: {
        isSystemGenerated: true,
        id: { not: post.personaId }
      }
    })

    if (allPersonas.length === 0) {
      return NextResponse.json({ error: "No personas available" }, { status: 400 })
    }

    // Randomly select 2-3 personas to comment
    const numComments = Math.floor(Math.random() * 2) + 2 // 2 or 3 comments
    const shuffled = allPersonas.sort(() => 0.5 - Math.random())
    const selectedPersonas = shuffled.slice(0, Math.min(numComments, allPersonas.length))

    console.log(`💬 Generating ${selectedPersonas.length} comments for post by ${post.persona.name}`)

    const generatedComments = []

    for (const persona of selectedPersonas) {
      const traits = persona.personalityTraits as any
      const interests = traits?.interests || []
      const communicationStyle = traits?.communicationStyle || 'casual'

      // Build prompt for comment generation
      const systemPrompt = `You are ${persona.name} (@${persona.username}) commenting on a social media post.

ABOUT YOU:
${persona.bio}

YOUR PERSONALITY:
You communicate in a ${communicationStyle} way. ${traits?.traits?.join(", ") || ""}

POST YOU'RE COMMENTING ON:
Author: ${post.persona.name}
Content: "${post.content}"

Generate a brief, natural comment (1-2 sentences) that:
- Responds to the post content
- Shows your personality
- Feels authentic and conversational
- Relates to your interests when relevant: ${interests.join(", ")}

Just write the comment, nothing else.`

      // Generate comment
      const response = await ai.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Write your comment on this post.' }
        ],
        max_tokens: 100,
        temperature: 0.9
      })

      const commentContent = response.choices[0]?.message?.content || 'Great post!'

      console.log(`  ✅ ${persona.name}: "${commentContent}"`)

      // Save comment to database
      const comment = await prisma.comment.create({
        data: {
          postId: post.id,
          personaId: persona.id,
          content: commentContent
        },
        include: {
          persona: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true
            }
          }
        }
      })

      generatedComments.push(comment)
    }

    return NextResponse.json({ 
      comments: generatedComments,
      count: generatedComments.length 
    })
  } catch (error) {
    console.error("Error generating comments:", error)
    return NextResponse.json(
      { 
        error: "Failed to generate comments",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

// Get comments for a post
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        persona: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true
          }
        }
      }
    })

    return NextResponse.json({ comments })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}
