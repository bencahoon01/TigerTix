const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://bencahoon01.github.io'
  ]
}));
app.use(express.json());

// Import route handlers
const adminRoutes = require('./admin-service/routes/adminRoute');
const clientRoutes = require('./client-service/routes/clientRoutes');
const authRoutes = require('./user-authentication/routes/authRoutes');

// Mount routes
app.use('/api', adminRoutes);      // Admin endpoints
app.use('/api', clientRoutes);     // Client endpoints  
app.use('/api/auth', authRoutes);  // Auth endpoints

// LLM Service - inline implementation to avoid module conflicts
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CLIENT_SERVICE_URL = 'http://localhost:3001/api/events';

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    // Fetch the real events from the client-service.
    const eventsResponse = await fetch(CLIENT_SERVICE_URL);
    if (!eventsResponse.ok) {
      throw new Error('Failed to fetch events from client-service.');
    }
    const events = await eventsResponse.json();
    const validEventNames = events.map(event => event.name);

    // Create the tools with the live event data.
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

      if (functionName === 'propose_booking') {
        const requestedName = (functionArgs.eventName || '').trim().toLowerCase();
        let eventObj = events.find(e => e.name.trim().toLowerCase() === requestedName);
        if (!eventObj) {
          eventObj = events.find(e => requestedName && e.name.trim().toLowerCase().includes(requestedName));
        }
        if (eventObj && eventObj.id) {
          const amount = functionArgs.amount && Number(functionArgs.amount) > 0 ? Number(functionArgs.amount) : 1;
          console.log('LLM booking intent (proposal only, no purchase):', {
            requestedEventName: functionArgs.eventName,
            matchedEvent: eventObj,
            eventId: eventObj.id,
            amount,
            timestamp: new Date().toISOString()
          });
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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'TigerTix Backend Running' });
});

app.listen(PORT, () => {
  console.log(`TigerTix unified backend running on port ${PORT}`);
});
