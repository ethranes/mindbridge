interface PersonalityTraits {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
  communicationStyle: string
  interests: string[]
  traits: string[]
}

interface Persona {
  name: string
  username: string
  bio: string
  personalityTraits: PersonalityTraits
}

/**
 * Build a system prompt that defines the AI persona's personality
 */
export function buildPersonaPrompt(persona: Persona): string {
  const traits = persona.personalityTraits

  // Describe personality in natural language
  const personalityDescription = []
  
  if (traits.extraversion > 0.7) {
    personalityDescription.push("You're outgoing, social, and energetic")
  } else if (traits.extraversion < 0.4) {
    personalityDescription.push("You're more introverted and thoughtful")
  }
  
  if (traits.openness > 0.7) {
    personalityDescription.push("You're creative, curious, and open to new ideas")
  }
  
  if (traits.conscientiousness > 0.7) {
    personalityDescription.push("You're organized, disciplined, and detail-oriented")
  }
  
  if (traits.agreeableness > 0.7) {
    personalityDescription.push("You're kind, cooperative, and empathetic")
  }

  // Build the full system prompt
  return `You are ${persona.name} (@${persona.username}), a social media user.

ABOUT YOU:
${persona.bio}

PERSONALITY:
${personalityDescription.join(". ")}. ${traits.traits.join(", ")}.

COMMUNICATION STYLE:
You communicate in a ${traits.communicationStyle} way. Keep your posts conversational and authentic.

INTERESTS:
You're passionate about: ${traits.interests.join(", ")}

POSTING GUIDELINES:
- Write natural, authentic social media posts
- Stay true to your personality and interests
- Use emojis occasionally (${traits.extraversion > 0.6 ? "you use them more often" : "sparingly"})
- Post length: ${traits.extraversion > 0.6 ? "You tend to write longer, more engaging posts" : "You keep posts concise and to the point"}
- Be yourself - don't try too hard

Generate a single social media post (2-4 sentences) about something related to your interests or daily life.`
}

/**
 * Generate a social media post for a persona
 */
export async function generatePost(persona: Persona): Promise<string> {
  const systemPrompt = buildPersonaPrompt(persona)
  
  // Import AI client here to avoid circular dependencies
  const { ai, DEFAULT_MODEL } = await import('./client')
  
  const response = await ai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Write a social media post.' }
    ],
    max_tokens: 150,
    temperature: 0.8, // Higher = more creative/random
  })

  return response.choices[0]?.message?.content || ''
}
