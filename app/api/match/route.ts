import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// Each answer scores points toward one or more specialties
// Scores are summed, then professionals are ranked highest to lowest

const SPECIALTY_SCORES: Record<string, Record<string, number>> = {
  // --- MOOD & EMOTIONS ---
  mood_very_low:        { depression: 3, cbt: 2, anxiety: 1 },
  mood_low:             { depression: 2, cbt: 1 },
  mood_moderate:        { cbt: 1 },
  mood_good:            {},
  mood_great:           {},

  // --- SLEEP & ENERGY ---
  sleep_very_poor:      { depression: 2, anxiety: 2 },
  sleep_poor:           { depression: 1, anxiety: 1 },
  sleep_moderate:       { anxiety: 1 },
  sleep_good:           {},
  sleep_great:          {},

  // --- ANXIETY LEVELS ---
  anxiety_severe:       { anxiety: 3, cbt: 2 },
  anxiety_high:         { anxiety: 2, cbt: 1 },
  anxiety_moderate:     { anxiety: 1, cbt: 1 },
  anxiety_mild:         {},
  anxiety_none:         {},

  // --- PAST TRAUMA ---
  trauma_severe:        { trauma: 3, depression: 1 },
  trauma_moderate:      { trauma: 2, cbt: 1 },
  trauma_mild:          { trauma: 1 },
  trauma_none:          {},

  // --- RELATIONSHIPS ---
  relationships_very_poor:  { relationships: 3, depression: 1 },
  relationships_poor:       { relationships: 2 },
  relationships_moderate:   { relationships: 1 },
  relationships_good:       {},
  relationships_great:      {},

  // --- LIFE EVENTS ---
  life_events_bereavement:  { grief: 3, depression: 1 },
  life_events_separation:   { grief: 2, relationships: 2 },
  life_events_job_loss:     { depression: 2, anxiety: 1 },
  life_events_major_change: { anxiety: 2, cbt: 1 },
  life_events_none:         {},
}

export async function POST(req: NextRequest) {
  try {
    const { answers } = await req.json()
    // answers is an array of answer keys e.g. ["mood_low", "sleep_poor", "anxiety_severe", ...]

    // Tally scores
    const totals: Record<string, number> = {
      trauma: 0,
      grief: 0,
      cbt: 0,
      anxiety: 0,
      depression: 0,
      relationships: 0,
    }

    for (const answer of answers) {
      const scores = SPECIALTY_SCORES[answer]
      if (scores) {
        for (const [specialty, points] of Object.entries(scores)) {
          totals[specialty] = (totals[specialty] || 0) + points
        }
      }
    }

    // Fetch all mental health professionals
    const professionals = await prisma.persona.findMany({
      where: {
        isSystemGenerated: true,
        username: {
          in: [
            'dr_sarah_heals',
            'dr_james_grief',
            'dr_rachel_cbt',
            'dr_priya_anxiety',
            'dr_marcus_depression',
            'dr_olivia_relate',
          ]
        }
      },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        avatarUrl: true,
        personalityTraits: true,
      }
    })

    // Attach score to each professional and rank
    const ranked = professionals
      .map((p: any) => {
        const traits = p.personalityTraits as any
        const specialty = traits?.specialty || ''
        const score = totals[specialty] || 0
        return { ...p, score, specialtyLabel: traits?.specialtyLabel || '' }
      })
      .sort((a: any, b: any) => b.score - a.score)

    return NextResponse.json({ ranked, totals })
  } catch (error) {
    console.error("Match error:", error)
    return NextResponse.json({ error: "Failed to match" }, { status: 500 })
  }
}
