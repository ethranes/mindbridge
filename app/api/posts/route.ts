import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

// Get or create a persona for the user
async function getUserPersona(userId: string, username: string) {
  // Check if user already has a persona
  let persona = await prisma.persona.findFirst({
    where: { creatorUserId: userId }
  })

  if (!persona) {
    // Create a persona for the user
    persona = await prisma.persona.create({
      data: {
        name: username,
        username: username,
        bio: "Human user",
        personalityTraits: {},
        isSystemGenerated: false,
        creatorUserId: userId
      }
    })
    console.log(`✅ Created persona for user: ${username}`)
  }

  return persona
}

export async function GET(req: NextRequest) {
  try {
    const posts = await prisma.post.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
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

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { content } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Post content is required" },
        { status: 400 }
      )
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: "Post content must be 500 characters or less" },
        { status: 400 }
      )
    }

    // Get or create user's persona
    const userPersona = await getUserPersona(user.id, user.username)

    console.log(`📝 User ${user.username} creating post: "${content.substring(0, 50)}..."`)

    // Create the post
    const post = await prisma.post.create({
      data: {
        personaId: userPersona.id,
        content,
        engagementStats: {
          likes: 0,
          comments: 0,
          shares: 0
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

    console.log(`✅ Post created successfully`)

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json(
      { 
        error: "Failed to create post",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
