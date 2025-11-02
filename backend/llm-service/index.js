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

const tools = [
  {
    type: 'function',
    function: {
      name: 'propose_booking',
      description: 'Propose a ticket booking to the user for a specific event.',
      parameters: {
        type: 'object',
        properties: {
          eventName: {
            type: 'string',
            description: 'The name of the event to book a ticket for, e.g., \'Clemson vs. South Carolina Football\'.',
          },
        },
        required: ['eventName'],
      },
    },
  },
];

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      tools: tools,
      tool_choice: 'auto',
    });

    const responseMessage = response.choices[0].message;

    if (responseMessage.tool_calls) {
      const toolCall = responseMessage.tool_calls[0];
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);

      if (functionName === 'propose_booking') {
        res.json({
          action: 'propose_booking',
          eventName: functionArgs.eventName,
        });
      } else {
        res.json({ response: 'Unknown action' });
      }
    } else {
      res.json({ response: responseMessage.content });
    }
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).json({ error: 'Failed to get response from LLM.' });
  }
});

app.listen(port, () => {
  console.log(`LLM service listening at http://localhost:${port}`);
});
