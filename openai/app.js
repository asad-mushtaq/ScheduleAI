const { OpenAI } = require('openai');
const express = require('express');
require('dotenv').config();

// Initialize Express app
const app = express();
const port = process.env.OPENAI_PORT;

// Initialize OpenAI with the API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Middleware to parse incoming JSON requests
app.use(express.json());

// CORS middleware
app.use(function(req, res, next) {
    // Set CORS headers for all incoming requests
    res.header("Access-Control-Allow-Origin", "http://localhost:4000");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");

    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
        return res.status(200).end(); // Respond directly to preflight request with status 200 OK
    }

    next(); // Proceed to other routes for non-OPTIONS requests
});

// Route to handle OpenAI queries
app.post('/', async (req, res) => {
    try {
        const userQuery = req.body.query;
        const { prompt, events } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: `User query not found.` });
        }

        // Log to check what we received
        console.log("Received prompt:", prompt);
        console.log("Received events:", events);

        // Create the content for the AI to use, including the events and the prompt
        const eventDescriptions = events.map(event => {
            return `Event Name: ${event.name}, Description: ${event.description}, Start Date: ${event.startDate}, Length: ${event.length} hours, Completed: ${event.completed ? 'Yes' : 'No'}, Tasks: ${JSON.stringify(event.tasks)}`;
        }).join("\n");

        // Call the OpenAI API with the user's query
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'developer', content: 'You are a helpful assistant that provides feedback based on the user prompt and event data. Make sure to include a list containing event Name, Description in your output that incorporates your feedback. Try to keep your output brief as I have set max tokens to 300. Format your response as html code that I can directly paste as inner html inside a span tag within my html page code.' },
                { role: 'user', content: `The user has provided the following events and prompt:\n\n${eventDescriptions}\n\nUser Prompt:\n"${prompt}"` }
            ],
            store: true,
            max_completion_tokens: 5000
        });

        console.log(eventDescriptions);
        console.log(prompt)

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
