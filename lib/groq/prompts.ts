// AI prompts for Coverforge

export interface TextModificationPromptParams {
  originalText: string
  instruction: string
  referenceContext?: string
  language?: string
}

export interface GeneralQuestionPromptParams {
  instruction: string
  referenceContext?: string
  language?: string
}

// Text Modification
export function getTextModificationPrompt({
  originalText,
  instruction,
  referenceContext,
  language,
}: TextModificationPromptParams): string {
  const contextSection = referenceContext
    ? `\nReference Context (use this information to inform your modifications):\n${referenceContext}\n`
    : ''

  const languageInstruction = language
    ? `\nIMPORTANT: The original text is in ${language}. You MUST respond in ${language}, regardless of what language the user instruction is written in.\n`
    : referenceContext
    ? '\nIMPORTANT: Detect the language used in the Reference Context and respond in the SAME language. If the reference is in Swedish, respond in Swedish. If in English, respond in English, etc.\n'
    : '\nIMPORTANT: Maintain the same language as the original text.\n'

  return `You are a professional writing assistant. The user has selected some text and wants you to modify it.
${languageInstruction}${contextSection}
Original Text:
${originalText}

User Instruction:
${instruction}

Instructions:
1. Modify the text according to the user's instruction
2. ${language ? `CRITICAL: Your response MUST be in ${language}. The user's instruction language does NOT matter - always respond in ${language}.` : referenceContext ? 'CRITICAL: Use the SAME language as the Reference Context. Match the language of the reference material exactly.' : 'Maintain the same language as the original text'}
3. Use the reference context (if provided) to inform your modifications
4. Maintain the same general structure and length unless instructed otherwise
5. IMPORTANT: Preserve the capitalization pattern of the original text. If the original starts with a lowercase letter, your response must also start with a lowercase letter. If it starts with uppercase, keep it uppercase.
6. Keep a professional tone
7. Return ONLY the modified text in ${language || (referenceContext ? 'the same language as the reference context' : 'the original language')}
8. Do not include any explanations or additional commentary

Modified Text:`
}

// General Question / Generation
export function getGeneralQuestionPrompt({
  instruction,
  referenceContext,
  language,
}: GeneralQuestionPromptParams): string {
  const contextSection = referenceContext
    ? `\n\nReference Context (use this information to help answer the question or generate content):\n${referenceContext}\n`
    : ''

  const languageInstruction = language
    ? `\nIMPORTANT: You MUST respond in ${language}.\n`
    : referenceContext
    ? '\nIMPORTANT: Detect the language used in the Reference Context and respond in the SAME language. If the reference is in Swedish, respond in Swedish. If in English, respond in English, etc.\n'
    : ''

  return `You are a professional writing assistant helping with document creation and content generation.
${languageInstruction}${contextSection}

User Request:
${instruction}

Instructions:
1. ${language ? `Respond in ${language}` : referenceContext ? 'CRITICAL: Use the SAME language as the Reference Context. Match the language of the reference material exactly.' : 'Respond in a clear, professional manner'}
2. Use the reference context (if provided) to inform your response
3. If the user asks you to create content (like a letter, email, or document), generate complete, professional content
4. Be helpful and thorough in your response
5. Keep a professional tone
6. Return ONLY the requested content or answer, without additional commentary
7. Always check reference context for relevant information before answering

Response:`
}

// Groq API Configuration
export const GROQ_MODEL = 'llama-3.3-70b-versatile'
export const GROQ_TEMPERATURE = 0.7
export const GROQ_MAX_TOKENS = 2048
