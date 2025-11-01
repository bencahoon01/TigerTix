/**
 * POST /api/client/llm/parse
 * Parses a natural-language booking request to extract event name, ticket quantity, and intent.
 * Currently returns a placeholder JSON response (LLM integration will be added later).
 * 
 * @param {object} req - Express request object, expects { text: string } in the body.
 * @param {object} res - Express response object.
 * @returns {JSON} 200 with structured parse result, 400 if input missing, or 500 with server error.
 */
const parseUserInput = async (req, res) => {
    const { text } = req.body;

    if (!text || text.trim() === "") {
        return res.status(400).json({ message: 'Missing or empty text input.' });
    }

    try {
        // Placeholder for future LLM or rule-based parsing logic
        const parsedResult = {
            event: 'Jazz Night',
            tickets: 2,
            intent: 'book'
        };

        return res.status(200).json(parsedResult);
    } catch (error) {
        console.error('Server error while parsing LLM input:', error);
        return res.status(500).json({
            message: 'Server error while parsing natural-language input.',
            error: error.message
        });
    }
};

module.exports = { parseUserInput };
