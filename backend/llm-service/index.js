const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// The client service is the source of truth for events.
const CLIENT_SERVICE_URL = 'http://localhost:6001/api/events';

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    // 1. Create a Direct Mana-Link: Fetch the real events from the client-service.
    const eventsResponse = await fetch(CLIENT_SERVICE_URL);
    if (!eventsResponse.ok) {
      throw new Error('Failed to fetch events from client-service.');
    }
    const events = await eventsResponse.json();
    const validEventNames = events.map(event => event.name);

    // 2. Dynamic Bounded Field: Create the tools with the live event data.
    const tools = [
      {
        type: 'function',
        function: {
          name: 'propose_booking',
          description: 'Propose a ticket booking for a specific event if and only if it exists in the provided list.',
          parameters: {
            type: 'object',
            properties: {
              eventName: {
                type: 'string',
                description: 'The name of the event to book a ticket for.',
                enum: validEventNames, // Use the dynamic list of events.
              },
            },
            required: ['eventName'],
          },
        },
      },
    ];

    // Direct Command Incantation!
    const systemMessage = {
      role: 'system',
      content: `You are a helpful assistant for booking tickets. You can only book tickets for the following events: ${validEventNames.join(', ')}. Do not guess the event. If the user asks for an event not on this list, you must state that you cannot find it.`,
    };

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [systemMessage, { role: 'user', content: message }],
      tools: tools,
      tool_choice: 'auto',
    });

    const responseMessage = response.choices[0].message;

    if (responseMessage.tool_calls) {
      const toolCall = responseMessage.tool_calls[0];
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);

      // 3. Absolute Judgment!
      if (functionName === 'propose_booking') {
        if (validEventNames.includes(functionArgs.eventName)) {
          res.json({
            action: 'propose_booking',
            eventName: functionArgs.eventName,
          });
        } else {
          res.json({ response: `Hmph! I can't book a ticket for "${functionArgs.eventName}" because that event doesn't exist, you dummy!` });
        }
      } else {
        res.json({ response: 'A mysterious power is interfering... try again!' });
      }
    } else {
      res.json({ response: responseMessage.content });
    }
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'Failed to get response from LLM.' });
  }
});

app.listen(port, () => {
  console.log(`LLM service listening at http://localhost:${port}`);
});
