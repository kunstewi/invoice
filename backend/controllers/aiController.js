const { getGeminiModel } = require("../config/gemini");

// @desc    Generate item description using AI
// @route   POST /api/ai/generate-description
// @access  Private
const generateDescription = async (req, res, next) => {
    try {
        const { itemName } = req.body;

        if (!itemName) {
            return res.status(400).json({
                success: false,
                message: "Please provide item name",
            });
        }

        const model = getGeminiModel();

        if (!model) {
            return res.status(503).json({
                success: false,
                message: "AI service is not available. Please check GEMINI_API_KEY configuration.",
            });
        }

        const prompt = `Generate a professional and concise description for an invoice item named "${itemName}". The description should be suitable for a business invoice and be 1-2 sentences long. Only provide the description, nothing else.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const description = response.text().trim();

        res.status(200).json({
            success: true,
            data: {
                itemName,
                description,
            },
        });
    } catch (error) {
        console.error("AI generation error:", error);
        next(error);
    }
};

// @desc    Suggest invoice items based on business type
// @route   POST /api/ai/suggest-items
// @access  Private
const suggestItems = async (req, res, next) => {
    try {
        const { businessType } = req.body;

        if (!businessType) {
            return res.status(400).json({
                success: false,
                message: "Please provide business type",
            });
        }

        const model = getGeminiModel();

        if (!model) {
            return res.status(503).json({
                success: false,
                message: "AI service is not available. Please check GEMINI_API_KEY configuration.",
            });
        }

        const prompt = `Suggest 5 common invoice items/services for a ${businessType} business. For each item, provide:
1. Item name
2. Brief description (1 sentence)
3. Typical price range (in USD)

Format the response as a JSON array with objects containing: name, description, and priceRange fields. Only return the JSON array, no additional text.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let suggestions = response.text().trim();

        // Try to parse JSON from the response
        try {
            // Remove markdown code blocks if present
            suggestions = suggestions.replace(/```json\n?/g, "").replace(/```\n?/g, "");
            const parsedSuggestions = JSON.parse(suggestions);

            res.status(200).json({
                success: true,
                data: {
                    businessType,
                    suggestions: parsedSuggestions,
                },
            });
        } catch (parseError) {
            // If JSON parsing fails, return raw text
            res.status(200).json({
                success: true,
                data: {
                    businessType,
                    suggestions: suggestions,
                },
            });
        }
    } catch (error) {
        console.error("AI suggestion error:", error);
        next(error);
    }
};

module.exports = {
    generateDescription,
    suggestItems,
};
