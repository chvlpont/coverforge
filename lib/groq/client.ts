import Groq from 'groq-sdk'
import {
  getTextModificationPrompt,
  GROQ_MODEL,
  GROQ_TEMPERATURE,
  GROQ_MAX_TOKENS,
  type TextModificationPromptParams,
} from './prompts'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Text Modification
export async function modifyText(
  params: TextModificationPromptParams
): Promise<string> {
  const prompt = getTextModificationPrompt(params)

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: GROQ_MODEL,
    temperature: GROQ_TEMPERATURE,
    max_tokens: GROQ_MAX_TOKENS,
  })

  return completion.choices[0]?.message?.content || ''
}
