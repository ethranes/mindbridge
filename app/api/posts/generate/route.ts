import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { generatePost } from "@/lib/ai/persona"

export async function POST(req: NextRequest) {
  try {
    // Get a random persona
    const personas = await prisma.persona.findMany({
      where: { isSystemGenerated: true }
    })

    if (personas.length === 0) {
      return NextResponse.json(
        { error: "No personas found. Run db:seed first." },
        { status: 400 }
      )
    }

    const randomPersona = personas[Math.floor(Math.random() * personas.length)]
    
    console.log(`🤖 Generating AI post for ${randomPersona.name}...`)

    // Generate post content using AI
    const content = await generatePost({
      name: randomPersona.name,
      username: randomPersona.username,
      bio: randomPersona.bio || '',
      personalityTraits: randomPersona.personalityTraits as any
    })

    console.log(`✅ Generated content: "${content.substring(0, 50)}..."`)

    // Create post in database
    const post = await prisma.post.create({
      data: {
        content,
        personaId: randomPersona.id,
        engagementStats: {
          likes: Math.floor(Math.random() * 50),
          comments: Math.floor(Math.random() * 10),
          shares: Math.floor(Math.random() * 5)
        }
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

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Error generating AI post:", error)
    return NextResponse.json(
      { 
        error: "Failed to generate post",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
