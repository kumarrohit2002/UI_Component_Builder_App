const { GoogleGenAI } = require("@google/genai");

const GeminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_AI_API_KEY });

const getGeminiAiResponse = async (prompt) => {
    const response = await GeminiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    return response.text;
};



module.exports = {  getGeminiAiResponse };

// specific to GEMINI model --> "gemini-embedding-001"

// •	If you need the best performance, go with 3072.
// •	If you’re optimizing for quality + storage + speed, go with 1536.
// •	If you’re constrained on resources and want reasonable quality, go with 768.

// •	output_dimensionality = 3072 → best quality
// •	output_dimensionality = 1536 → best trade-off
// •	output_dimensionality = 768 → efficient, still decent