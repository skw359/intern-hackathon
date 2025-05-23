require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI with API key
const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_API_KEY);
// Initialize Gemini model
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Generate workout content using Google's Gemini AI
 * @param {string} promptText - Text prompt for workout generation
 * @returns {string} Generated workout plan
 * @throws {Error} If generation fails
 */
async function generateWithGemini(promptText) {
  try {
    // Generate content with specified parameters
    const result = await model.generateContent({
      contents: [{ 
        role: 'user',
        parts: [{ text: `Create a structured workout plan based on: "${promptText}"` }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192
      }
    });

    // Log raw response for debugging
    console.dir(result, { depth: null });

    const text = result.response.candidates[0].content.parts[0].text;

    // Remove all backtick code blocks, including ones with optional language labels and whitespace
    const cleaned = text
    .replace(/^\s*```(?:json)?\s*/i, '')  // opening ```json or ```
    .replace(/\s*```\s*$/, '')            // closing ```
    .trim();

    const json = JSON.parse(cleaned);

    return json;
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    if (error.response) {
      console.error('Error details:', error.response);
    }
    throw error;
  }
}

module.exports = { generateWithGemini };
