import OpenAI from 'openai'

// Together.ai client (uses OpenAI-compatible API)
export const ai = new OpenAI({
  apiKey: process.env.TOGETHER_API_KEY,
  baseURL: 'https://api.together.xyz/v1',
})

// Default model - good balance of speed/quality/cost
export const DEFAULT_MODEL = 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo'

// Alternative models you can try:
// - 'mistralai/Mixtral-8x7B-Instruct-v0.1' (better quality, more expensive)
// - 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo' (best quality, slower)
