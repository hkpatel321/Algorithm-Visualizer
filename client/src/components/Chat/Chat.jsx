import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {BaseUrl} from '../../utils/BaseUrl.js';
function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/api/chat/getMessages`, { withCredentials: true });
        if (response.data.success) {
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      console.log('Saving message:', { userId: user.id, message: input, sender: 'user' });
      const response = await axios.post(`${BaseUrl}/api/chat/saveMessage`, 
        { message: input, sender: 'user' }, 
        { withCredentials: true }
      );
      console.log('Message saved response:', response.data); // Log the response data
      if (!response.data.success) {
        throw new Error('Failed to save message');
      }

      const botResponse = await axios.post(`${BaseUrl}/api/chat/generateResponse`, 
        { message: input }, 
        { withCredentials: true }
      );
      console.log('Bot response:', botResponse.data); // Log the bot response data
      const botMessage = { text: botResponse.data.message, sender: 'bot' };
      
      setMessages(prev => [...prev, botMessage]);

      await axios.post(`${BaseUrl}/api/chat/saveMessage`, 
        { message: botMessage.text, sender: 'bot' }, 
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        error: true
      }]);
    }
    setIsLoading(false);
  };

  return (    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto chat-container rounded-xl shadow-2xl flex flex-col h-[80vh]">
        <div className="p-4 border-b border-purple-900/40 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">Algorithm Assistant</h3>
          <button
            onClick={() => navigate('/chat-history')}
            className="text-purple-400 hover:text-purple-300 text-sm px-4 py-2 border border-purple-400 rounded-lg transition-colors duration-200"
          >
            View History
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[60%] rounded-lg p-4 ${
                  message.sender === 'user'
                    ? 'bg-purple-600/70 text-white'
                    : 'bg-gray-700/70 text-gray-100'
                } ${message.error ? 'bg-red-500/70' : ''} chat-message`}
              >
                <div 
                  dangerouslySetInnerHTML={{ __html: message.text }}
                  className="prose prose-invert max-w-none"
                />
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700/70 text-gray-100 rounded-lg p-4">
                Thinking...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-6 border-t border-purple-900/40">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about algorithms..."
              className="flex-1 bg-gray-800/50 text-white rounded-lg px-6 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-colors duration-200 text-lg font-medium min-w-[120px]"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;
