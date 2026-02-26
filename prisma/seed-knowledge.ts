import { PrismaClient } from '@prisma/client'
import { CLINICAL_KNOWLEDGE } from '../lib/knowledge/clinical-content'
import { buildKeywords } from '../lib/ai/embeddings'

const prisma = new PrismaClient()

async function main() {
  console.log('🧠 Seeding clinical knowledge base...\n')

  await prisma.knowledgeChunk.deleteMany({})
  console.log('🗑️  Cleared existing knowledge chunks\n')

  let count = 0
  for (const entry of CLINICAL_KNOWLEDGE) {
    process.stdout.write(`📄 Indexing "${entry.title}"...`)

    const keywords = buildKeywords(entry.title, entry.content)

    await prisma.knowledgeChunk.create({
      data: {
        specialty: entry.specialty,
        title: entry.title,
        content: entry.content,
        keywords,
      }
    })

    console.log(' ✅')
    count++
  }

  console.log(`\n🎉 Knowledge base seeding complete!`)
  console.log(`📊 ${count} chunks indexed`)
  console.log(`\nSpecialties covered:`)
  const specialties = [...new Set(CLINICAL_KNOWLEDGE.map(k => k.specialty))]
  for (const s of specialties) {
    const n = CLINICAL_KNOWLEDGE.filter(k => k.specialty === s).length
    console.log(`  ${s}: ${n} chunks`)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding knowledge base:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
