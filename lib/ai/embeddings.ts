/**
 * Keyword-based retrieval — no external API needed.
 * Uses TF-IDF style term frequency matching with stopword filtering.
 * Works well for a small, fixed knowledge base like this one.
 */

const STOPWORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with',
  'by','from','is','it','its','this','that','these','those','was','are',
  'be','been','being','have','has','had','do','does','did','will','would',
  'could','should','may','might','can','as','if','not','so','up','out',
  'we','you','i','they','he','she','they','their','your','our','my',
  'how','what','when','where','which','who','whom','why','more','also',
  'very','just','about','into','than','then','them','there','through',
])

/**
 * Tokenise text into meaningful terms
 */
function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOPWORDS.has(t))
}

/**
 * Build a keyword string for storage (called at seed time)
 */
export function buildKeywords(title: string, content: string): string {
  const tokens = tokenise(`${title} ${content}`)
  // Deduplicate but weight repeated terms by including them multiple times
  const freq: Record<string, number> = {}
  for (const t of tokens) freq[t] = (freq[t] || 0) + 1
  // Include high-frequency terms more times so they score higher in retrieval
  const weighted: string[] = []
  for (const [term, count] of Object.entries(freq)) {
    const repeats = Math.min(count, 5)
    for (let i = 0; i < repeats; i++) weighted.push(term)
  }
  return weighted.join(' ')
}

/**
 * Score a chunk's keywords against a query using term overlap (Jaccard-style)
 */
function scoreChunk(queryTokens: Set<string>, chunkKeywords: string): number {
  const chunkTokens = chunkKeywords.split(' ')
  let matches = 0
  for (const token of chunkTokens) {
    if (queryTokens.has(token)) matches++
  }
  // Normalise by query length so short specific queries aren't penalised
  return matches / Math.max(queryTokens.size, 1)
}

/**
 * Retrieve the most relevant knowledge chunks for a user message.
 * Filters by specialty first, then ranks by keyword overlap.
 */
export async function retrieveRelevantChunks(
  query: string,
  specialty: string,
  topK: number = 3
): Promise<{ title: string; content: string; score: number }[]> {
  const { prisma } = await import('../db')

  const queryTokens = new Set(tokenise(query))
  if (queryTokens.size === 0) return []

  // Load chunks for this specialty + general
  const chunks = await prisma.knowledgeChunk.findMany({
    where: { specialty: { in: [specialty, 'general'] } },
    select: { title: true, content: true, keywords: true },
  })

  if (chunks.length === 0) return []

  const scored = chunks.map(chunk => ({
    title: chunk.title,
    content: chunk.content,
    score: scoreChunk(queryTokens, chunk.keywords),
  }))

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter(c => c.score > 0) // Only include chunks with at least one term match
}
