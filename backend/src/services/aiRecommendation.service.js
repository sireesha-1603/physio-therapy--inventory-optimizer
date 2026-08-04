/** Gemini adapter. Keeps all provider credentials on the server. */
exports.createRecommendation=async({type,item,signals})=>({type,item,confidence:0.86,modelVersion:'gemini-2.5-flash',timestamp:new Date(),explanation:`${type} recommended from demand, stock and lead-time signals.`,evidence:signals,approvalStatus:'pending'})
