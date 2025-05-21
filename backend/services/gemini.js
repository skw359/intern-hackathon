// backend/services/gemini.js
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize with your API key
const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_API_KEY);

async function generateWithGemini(promptText) {
  try {
    // Get the model - use the correct model name without 'models/' prefix
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // The correct method is generateContent, not generateText
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
    const candidate = result.response.candidates[0];
    console.log('💡 Raw Gemini response:', candidate.content);   

    // Get the response text from the result
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    // Log additional error details if available
    if (error.response) {
      console.error('Error details:', error.response);
    }
    throw error;
  }
}

module.exports = { generateWithGemini };