import Groq from 'groq-sdk'
import {
  getTextModificationPrompt,
  getGeneralQuestionPrompt,
  GROQ_MODEL,
  GROQ_TEMPERATURE,
  GROQ_MAX_TOKENS,
  type TextModificationPromptParams,
  type GeneralQuestionPromptParams,
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

// General Question / Content Generation
export async function answerGeneralQuestion(
  params: GeneralQuestionPromptParams
): Promise<string> {
  const prompt = getGeneralQuestionPrompt(params)

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: GROQ_MODEL,
    temperature: GROQ_TEMPERATURE,
    max_tokens: GROQ_MAX_TOKENS,
  })

  return completion.choices[0]?.message?.content || ''
}
