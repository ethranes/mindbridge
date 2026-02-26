import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/db"
import { signUpSchema } from "@/lib/validations/auth"
import { ZodError } from "zod"

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json()
    console.log("Signup request received:", { ...body, password: "***" })

    // Validate with Zod
    const validatedData = signUpSchema.parse(body)
    console.log("Validation passed")

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username }
        ]
      }
    })

    if (existingUser) {
      const errorMessage = existingUser.email === validatedData.email 
        ? "Email already registered" 
        : "Username already taken"
      console.log("User already exists:", errorMessage)
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    // Hash password
    console.log("Hashing password...")
    const passwordHash = await hash(validatedData.password, 12)

    // Create user
    console.log("Creating user in database...")
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        username: validatedData.username,
        passwordHash,
        subscriptionTier: "free"
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true
      }
    })

    console.log("User created successfully:", user.id)

    return NextResponse.json(
      { 
        message: "User created successfully",
        user 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Full error object:", error)
    console.error("Error type:", error?.constructor?.name)
    
    if (error instanceof ZodError) {
      console.error("Zod validation errors:", error.issues)
      return NextResponse.json(
        { 
          error: "Validation failed",
          details: error.issues 
        },
        { status: 400 }
      )
    }

    console.error("Unexpected error during signup:", error)
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
