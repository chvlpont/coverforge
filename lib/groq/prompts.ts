// AI prompts for Coverforge

export interface TextModificationPromptParams {
  originalText: string
  instruction: string
  referenceContext?: string
  language?: string
}

export interface GeneralQuestionPromptParams {
  instruction: string
  documentContent?: string
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
    ? `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 ADDITIONAL REFERENCE MATERIAL (FOR YOUR INFORMATION ONLY - DO NOT MODIFY OR INCLUDE THIS IN YOUR RESPONSE):
${referenceContext}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`
    : ''

  const languageInstruction = language
    ? `🔴 LANGUAGE: Respond in ${language} only.`
    : 'Respond in the SAME language as the selected text below.'

  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 SELECTED TEXT TO MODIFY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${originalText}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 USER'S INSTRUCTION:
${instruction}

🔴 YOUR TASK:
Modify the "SELECTED TEXT TO MODIFY" above according to the user's instruction.
${languageInstruction}
Return ONLY the modified version of the selected text - nothing else.
${contextSection}

🚫 DO NOT:
- Modify or include the reference material (if provided)
- Add explanations or commentary
- Change the language of the selected text
- Use HTML tags (<p>, <br>, <div>, etc.) - return plain text only

✅ DO:
- Modify ONLY the "SELECTED TEXT TO MODIFY" section
- Keep the same language as the selected text
- Apply the user's instruction (${instruction}) to the selected text
- Return plain text without any HTML formatting

MODIFIED VERSION OF SELECTED TEXT (PLAIN TEXT, NO HTML TAGS):`
}

// General Question / Generation
export function getGeneralQuestionPrompt({
  instruction,
  documentContent,
  referenceContext,
  language,
}: GeneralQuestionPromptParams): string {
  const documentSection = documentContent
    ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 CURRENT DOCUMENT CONTENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${documentContent}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`
    : ''

  const contextSection = referenceContext
    ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 REFERENCE MATERIAL (FOR CONTEXT ONLY - DO NOT MODIFY THIS):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${referenceContext}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`
    : ''

  const languageInstruction = language
    ? `${language}`
    : documentContent
    ? 'the SAME language as the document content'
    : referenceContext
    ? 'the SAME language as the reference material'
    : 'a clear, professional manner'

  return `You are a professional writing assistant helping with document creation and content generation.
${documentSection}${contextSection}
📝 USER REQUEST:
${instruction}

🔴 YOUR TASK:
${language ? `Respond in ${language}.` : documentContent ? 'Respond in the SAME language as the document content.' : 'Respond appropriately to the request.'}

📋 INSTRUCTIONS:
1. ${documentContent ? 'Modify/work with the DOCUMENT CONTENT above based on the user request' : 'Generate new content based on the user request'}
2. Reference material (if provided) is ONLY for context - NEVER modify or include it in your response
3. Common requests:
   - "Make it shorter" / "gör den kortare": ${documentContent ? 'Shorten the DOCUMENT CONTENT by 30-50%' : 'Generate shorter content'}
   - "Make it longer" / "gör den längre": ${documentContent ? 'Expand the DOCUMENT CONTENT with more details' : 'Generate longer content'}
   - "Improve" / "förbättra": ${documentContent ? 'Enhance the DOCUMENT CONTENT' : 'Generate improved content'}
   - "Write a letter/email": Generate new content using reference material for context
4. Language: Respond in ${languageInstruction}
5. Format: Return PLAIN TEXT ONLY - NO HTML tags (<p>, <br>, <div>, etc.), NO markdown formatting
6. Return ONLY the requested content - NO explanations, NO meta-commentary
7. Keep a professional tone unless instructed otherwise

RESPONSE (PLAIN TEXT, NO HTML TAGS):`
}

// Groq API Configuration
export const GROQ_MODEL = 'llama-3.3-70b-versatile'
export const GROQ_TEMPERATURE = 0.7
export const GROQ_MAX_TOKENS = 2048
