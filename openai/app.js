const { OpenAI } = require('openai');
const express = require('express');
require('dotenv').config();

// Initialize Express app
const app = express();
const port = 6000;

// Initialize OpenAI with the API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Middleware to parse incoming JSON requests
app.use(express.json());

// Route to handle OpenAI queries
app.post('/query', async (req, res) => {
    try {
        const userQuery = req.body.query;

        if (!userQuery) {
            return res.status(400).json({ error: 'User query not found.' });
        }

        // Call the OpenAI API with the user's query
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'developer', content: 'You are a helpful assistant.' },
                { role: 'user', content: userQuery }
            ],
            store: true,
            max_completion_tokens: 50
        });

        res.json({ response: response.choices[0].message.content });
        console.log(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: error.status,
            error: 'Failed to query OpenAI API.',
            request_id: error.request_id,
            message: error.message,
            type: error.type
        });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
