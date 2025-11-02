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
          description: 'Propose a ticket booking for a specific event. Parse both the event name and the number of tickets (amount) from the user input. If the user does not specify an amount, default to 1.',
          parameters: {
            type: 'object',
            properties: {
              eventName: {
                type: 'string',
                description: 'The name of the event to book a ticket for.'
              },
              amount: {
                type: 'integer',
                description: 'The number of tickets to purchase.',
                default: 1
              }
            },
            required: ['eventName'],
          },
        },
      },
    ];

    // Direct Command Incantation!
    const systemMessage = {
      role: 'system',
      content: `You are a helpful assistant for booking tickets. You can only book tickets for the following events: ${validEventNames.join(', ')}. When the user asks to buy tickets, always extract both the event name and the number of tickets (amount) from their message. If the user does not specify an amount, default to 1. Do not guess the event. If the user asks for an event not on this list, you must state that you cannot find it.`,
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
        // Robust event name matching
        const requestedName = (functionArgs.eventName || '').trim().toLowerCase();
        // Find best match: exact, then partial
        let eventObj = events.find(e => e.name.trim().toLowerCase() === requestedName);
        if (!eventObj) {
          eventObj = events.find(e => requestedName && e.name.trim().toLowerCase().includes(requestedName));
        }
        if (eventObj && eventObj.id) {
          const amount = functionArgs.amount && Number(functionArgs.amount) > 0 ? Number(functionArgs.amount) : 1;
          // Log what the LLM is doing
          console.log('LLM booking intent (proposal only, no purchase):', {
            requestedEventName: functionArgs.eventName,
            matchedEvent: eventObj,
            eventId: eventObj.id,
            amount,
            timestamp: new Date().toISOString()
          });
          // Only propose booking, do NOT call purchase API
          return res.json({
            action: 'propose_booking',
            eventName: eventObj.name,
            eventId: eventObj.id,
            amount
          });
        } else {
          console.warn('LLM could not find event for:', functionArgs.eventName, 'EventObj:', eventObj);
          return res.status(400).json({ response: `Could not find a valid event for "${functionArgs.eventName}". Please check the event name and try again.` });
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
