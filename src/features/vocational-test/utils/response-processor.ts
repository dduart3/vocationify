/**
 * Processes voice transcript and converts it to RIASEC response value (1-5 scale)
 */
export function processTranscriptToValue(transcript: string): number {
  if (!transcript || transcript.trim().length === 0) {
    return 3 // Neutral response if no transcript
  }
  
  const text = transcript.toLowerCase().trim()
  
  // Spanish response patterns for RIASEC scale (1-5)
  const strongPositivePatterns = [
    /\b(me fascina|amo|adoro|me apasiona|es lo mío|exactamente|totalmente de acuerdo)\b/,
    /\b(muchísimo|extremadamente|completamente|absolutamente|siempre)\b/,
    /\b(perfecto|excelente|increíble|fantástico)\b/
  ]
  
  const positivePatterns = [
    /\b(sí|si|yes|claro|por supuesto|definitivamente|me encanta|me gusta mucho|totalmente)\b/,
    /\b(muy de acuerdo|estoy de acuerdo|de acuerdo|correcto|exacto)\b/,
    /\b(frecuentemente|a menudo|mucho|bastante|casi siempre)\b/,
    /\b(me gusta|me interesa|me atrae|está bien)\b/
  ]
  
  const neutralPatterns = [
    /\b(tal vez|quizás|no sé|no estoy seguro|más o menos|regular|normal|neutral)\b/,
    /\b(a veces|de vez en cuando|ocasionalmente|depende|puede ser)\b/,
    /\b(ni sí ni no|término medio|moderadamente)\b/
  ]
  
  const negativePatterns = [
    /\b(no me gusta|no me interesa|no me atrae|me disgusta|no estoy de acuerdo)\b/,
    /\b(raramente|casi nunca|muy poco|pocas veces)\b/,
    /\b(no|no mucho|no tanto|no realmente)\b/
  ]
  
  const strongNegativePatterns = [
    /\b(odio|detesto|aborrezco|me repugna|jamás|nunca jamás|para nada en absoluto)\b/,
    /\b(completamente en desacuerdo|totalmente en contra|nunca|jamás)\b/,
    /\b(horrible|terrible|pésimo|muy mal)\b/
  ]
  
  // Check for strong responses first
  if (strongPositivePatterns.some(pattern => pattern.test(text))) {
    return 5 // Strongly agree
  }
  if (strongNegativePatterns.some(pattern => pattern.test(text))) {
    return 1 // Strongly disagree
  }
  
  // Check for regular responses
  if (positivePatterns.some(pattern => pattern.test(text))) {
    return 4 // Agree
  }
  if (negativePatterns.some(pattern => pattern.test(text))) {
    return 2 // Disagree
  }
  if (neutralPatterns.some(pattern => pattern.test(text))) {
    return 3 // Neutral
  }
  
  // Fallback: analyze sentence structure and sentiment
  if (text.includes('gusta') || text.includes('interesa') || text.includes('bien')) {
    return 4
  }
  if (text.includes('no') && text.length < 10) {
    return 2
  }
  
  return 3 // Default neutral
}

/**
 * Converts numeric response to descriptive text
 */
export function getResponseDescription(value: number): string {
  switch (value) {
    case 1: return 'Totalmente en desacuerdo'
    case 2: return 'En desacuerdo'
    case 3: return 'Neutral'
    case 4: return 'De acuerdo'
    case 5: return 'Totalmente de acuerdo'
    default: return 'Respuesta inválida'
  }
}

/**
 * Gets color for response value
 */
export function getResponseColor(value: number): string {
  switch (value) {
    case 1: return 'text-red-400'
    case 2: return 'text-orange-400'
    case 3: return 'text-slate-400'
    case 4: return 'text-green-400'
    case 5: return 'text-emerald-400'
    default: return 'text-slate-400'
  }
}