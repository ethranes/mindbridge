import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

// Get all conversations for the current user
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find all unique conversation IDs where user is involved
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderPersonaId: user.id },
          { receiverPersonaId: user.id }
        ]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true
          }
        }
      },
      take: 100
    })

    // Group by conversation and get latest message per conversation
    const conversationMap = new Map()
    
    messages.forEach(message => {
      const conversationId = message.conversationId
      if (!conversationMap.has(conversationId)) {
        conversationMap.set(conversationId, {
          conversationId,
          lastMessage: message,
          unreadCount: 0
        })
      }
      
      // Count unread messages
      if (!message.isRead && message.receiverPersonaId === user.id) {
        const conv = conversationMap.get(conversationId)
        conv.unreadCount++
      }
    })

    const conversations = Array.from(conversationMap.values())

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    )
  }
}
