const { GoogleGenAI } = require("@google/genai");

let genAI = null;

const initializeGemini = () => {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("Warning: GEMINI_API_KEY not found. AI features will be disabled.");
        return null;
    }

    try {
        genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        console.log("Google Generative AI initialized successfully");
        return genAI;
    } catch (error) {
        console.error("Error initializing Gemini AI:", error.message);
        return null;
    }
};

const getGeminiModel = () => {
    if (!genAI) {
        initializeGemini();
    }
    return genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;
};

module.exports = { initializeGemini, getGeminiModel };
