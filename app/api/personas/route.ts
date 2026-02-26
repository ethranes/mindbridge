import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const personas = await prisma.persona.findMany({
      where: {
        isSystemGenerated: true
      },
      orderBy: {
        name: 'asc'
      },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        avatarUrl: true
      }
    })

    return NextResponse.json({ personas })
  } catch (error) {
    console.error("Error fetching personas:", error)
    return NextResponse.json(
      { error: "Failed to fetch personas" },
      { status: 500 }
    )
  }
}
