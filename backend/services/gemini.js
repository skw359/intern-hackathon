require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI with API key
const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_API_KEY);

/**
 * Generate workout content using Google's Gemini AI
 * @param {string} promptText - Text prompt for workout generation
 * @returns {string} Generated workout plan
 * @throws {Error} If generation fails
 */
async function generateWithGemini(promptText) {
  try {
    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Generate content with specified parameters
    const result = await model.generateContent({
      contents: [{ 
        role: 'user',
        parts: [{ text: `Create a structured workout plan based on: "${promptText}"` }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512
      }
    });

    // Log raw response for debugging
    const candidate = result.response.candidates[0];
    console.log('💡 Raw Gemini response:', candidate.content);   

    // Extract and return generated text
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    if (error.response) {
      console.error('Error details:', error.response);
    }
    throw error;
  }
}

module.exports = { generateWithGemini };