
import React, { useState, useEffect } from 'react';
import confirmSound from '../assets/confirm-purchase.mp3';

const Chat = ({ onBuyTicket }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [proposedBooking, setProposedBooking] = useState(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const newMessages = [...messages, { text: inputValue, sender: 'user' }];
    setMessages(newMessages);
    setInputValue('');

    try {
      const response = await fetch(`${process.env.REACT_APP_LLM_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      });

      const data = await response.json();

      if (data.action === 'propose_booking') {
        // Store the full booking proposal (eventId, eventName, amount)
        setProposedBooking({
          eventId: data.eventId,
          eventName: data.eventName,
          amount: data.amount || 1
        });
        const newMessagesWithLlm = [...newMessages, { text: `I can help with that. Would you like to buy ${data.amount || 1} ticket(s) for ${data.eventName}?`, sender: 'llm', needsConfirmation: true }];
        setMessages(newMessagesWithLlm);
        if (isTtsEnabled) {
          speak(`I can help with that. Would you like to buy ${data.amount || 1} ticket(s) for ${data.eventName}?`);
        }
      } else {
        const llmResponse = data.response;
        const newMessagesWithLlm = [...newMessages, { text: llmResponse, sender: 'llm' }];
        setMessages(newMessagesWithLlm);

        if (isTtsEnabled) {
          speak(llmResponse);
        }
      }
    } catch (error) {
      console.error('Error communicating with LLM service:', error);
    }
  };

  const handleConfirmPurchase = () => {
    const audio = new Audio(confirmSound);
    audio.play();
    if (proposedBooking && proposedBooking.eventId) {
      onBuyTicket(proposedBooking.eventId, proposedBooking.amount);
      const newMessages = [...messages, { text: `Ticket purchased for ${proposedBooking.amount} ticket(s) to ${proposedBooking.eventName}.`, sender: 'llm' }];
      setMessages(newMessages);
    } else {
      const newMessages = [...messages, { text: `Could not complete purchase. Invalid event or ID.`, sender: 'llm' }];
      setMessages(newMessages);
    }
    setProposedBooking(null);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setInputValue(speechResult);
    };

    recognition.onspeechend = () => {
      recognition.stop();
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.2;
    utterance.rate = 1.1;
    speechSynthesis.speak(utterance);
  };

  const toggleTts = () => {
    setIsTtsEnabled(!isTtsEnabled);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-10 z-50">
      <button
        className="bg-orange-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg"
        onClick={toggleChat}
      >
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.455.09-.934.09-1.423C6 13.23 7.51 8.25 12 8.25c4.97 0 9 3.694 9 8.25Z" />
</svg>
      </button>
      {isOpen && (
        <div className="bg-white rounded-lg shadow-lg w-80 h-96 flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Jynxi</h2>
            <button onClick={toggleTts} className={`px-2 py-1 rounded-full text-sm ${isTtsEnabled ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {isTtsEnabled ? 'TTS ON' : 'TTS OFF'}
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`my-2 p-2 rounded-lg ${message.sender === 'user' ? 'bg-orange-500 text-white self-end' : 'bg-gray-200 self-start'}`}>
                {message.text}
                {message.needsConfirmation && (
                  <button
                    className="ml-2 bg-green-500 text-white rounded-full px-4 py-2 mt-2"
                    onClick={handleConfirmPurchase}
                  >
                    Confirm Purchase
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="p-4 border-t flex">
            <input
              type="text"
              className="flex-1 border rounded-full px-4 py-2"
              placeholder="Type a message..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <button
              className="ml-2 bg-orange-500 text-white rounded-full px-4 py-2"
              onClick={handleSendMessage}
            >
              Send
            </button>
            <button
              className="ml-2 bg-gray-300 text-gray-700 rounded-full p-2"
              onClick={handleVoiceInput}
            >
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 0 1 6 0v8.25a3 3 0 0 1-3 3Z" />
</svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
