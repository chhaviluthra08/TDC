import { generateText } from 'ai'

export const maxDuration = 30

interface IntroBody {
  clientName?: string
  candidateName?: string
  candidateAge?: number
  candidateProfession?: string
  candidateCity?: string
  sharedValue?: string
}

function fallbackIntro(b: IntroBody) {
  const name = b.candidateName ?? 'this match'
  const age = b.candidateAge ?? ''
  const prof = b.candidateProfession ?? 'professional'
  const city = b.candidateCity ?? 'India'
  const value = b.sharedValue ?? 'building a life with shared purpose'
  return `Meet ${name} — a ${age}-year-old ${prof} from ${city} who shares your views on ${value}. We think the two of you see partnership the same way: as something you build together, with intention.`
}

export async function POST(req: Request) {
  const body = (await req.json()) as IntroBody

  // Graceful fallback when no model access is configured.
  if (!process.env.AI_GATEWAY_API_KEY && process.env.VERCEL !== '1') {
    // In local dev without a gateway key, still allow zero-config providers
    // but guard the call so the UI always gets a usable intro.
  }

  try {
    const { text } = await generateText({
      model: 'google/gemini-3-flash',
      prompt: `You are a warm, perceptive human matchmaker at The Date Crew, a premium
human-first matchmaking studio in India. Write a 2-sentence introduction that a
matchmaker would send to their client "${body.clientName ?? 'our client'}" about a
suggested match named "${body.candidateName}".

Match details: ${body.candidateAge}-year-old ${body.candidateProfession} from
${body.candidateCity}. Shared value to emphasise: "${body.sharedValue}".

Rules:
- Focus on shared life goals, values and the way they approach partnership.
- Do NOT lead with demographics, height, income, or a checklist.
- Warm, human, editorial tone. Exactly 2 sentences. No emojis. No greeting line.`,
    })

    const intro = text?.trim()
    if (!intro) {
      return Response.json({ intro: fallbackIntro(body), source: 'fallback' })
    }
    return Response.json({ intro, source: 'ai' })
  } catch {
    return Response.json({ intro: fallbackIntro(body), source: 'fallback' })
  }
}
