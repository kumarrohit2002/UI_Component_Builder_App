const { getGeminiAiResponse } = require("../configs");

const generateJSX = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const aiResponse = await getGeminiAiResponse(`
You are a senior React developer with 10 years of experience.

Your task:
1. ONLY return a valid JSON object with a JSX string.
2. Use only Tailwind CSS classes in the JSX.
3. DO NOT include explanations or markdown.
4. DO NOT include \`\`\` or any formatting.
5. DO NOT include HTML or CSS outside JSX.

Respond ONLY like this:
{
  "jsx": "<JSX string here>"
}

Prompt: ${prompt}
    `);

    console.log("AI raw response:", aiResponse); // helpful for debugging

    let jsx = "";

    try {
      // Try to find the first valid JSON object that contains "jsx"
      const jsonMatch = [...aiResponse.matchAll(/\{[^{}]*"jsx"[^{}]*\}/g)];
      const firstJSON = jsonMatch?.[0]?.[0];

      if (firstJSON) {
        const parsed = JSON.parse(firstJSON);
        jsx = parsed.jsx?.trim() || "";
      } else {
        throw new Error("AI response did not contain valid JSON.");
      }
    } catch (err) {
      console.warn("Fallback due to JSON parsing error:", err.message);
      jsx = `<div className="text-red-600 font-semibold">Invalid AI response: "${prompt}"</div>`;
    }

    return res.status(200).json({ jsx });
  } catch (error) {
    console.error("Error in generateJSX:", error.message);
    return res.status(500).json({
      error: "An error occurred while generating JSX",
    });
  }
};

module.exports = { generateJSX };
