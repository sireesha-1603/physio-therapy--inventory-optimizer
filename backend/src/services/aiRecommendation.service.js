/** Gemini adapter. The API key is read only from the server environment. */
exports.createRecommendation = async ({ type, item, signals }) => {
  const fallback = (reason) => {
    const stock=Number(signals.currentStock||0), reorder=Number(signals.reorderPoint||0), safety=Number(signals.safetyStock||0), suggested=Number(signals.suggestedQty||Math.max(reorder*2-stock,safety))
    return { type, item, confidence: stock <= safety ? .78 : .7, modelVersion:'InventoryRules-fallback-v1', timestamp:new Date(), explanation:`Rule-based fallback: current stock (${stock}) is at or below the reorder threshold (${reorder}). Recommended replenishment quantity is ${suggested} units.`, evidence:[`Current stock: ${stock}`,`Reorder point: ${reorder}`,`Safety stock: ${safety}`,`Fallback reason: ${reason}`], approvalStatus:'pending', providerStatus:'fallback' }
  }
  if (!process.env.GEMINI_API_KEY) return fallback('Gemini API key is not configured')
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
  const prompt = `You are an inventory decision-support assistant for a physiotherapy chain. Return valid JSON only with keys confidence (number 0-1), explanation (string), and evidence (array of strings). Assess this ${type} recommendation for item "${item}" using these signals: ${JSON.stringify(signals)}. Do not invent clinical facts.`
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.2 } }) })
    if (!response.ok) throw new Error(`Gemini request failed (${response.status})`)
    const payload = await response.json(); const text = payload.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) throw new Error('Gemini returned no recommendation content.')
    const ai = JSON.parse(text)
    return { type, item, confidence: ai.confidence, modelVersion: model, timestamp: new Date(), explanation: ai.explanation, evidence: ai.evidence, approvalStatus: 'pending', providerStatus:'gemini' }
  } catch (error) { return fallback(error.message) }
}
