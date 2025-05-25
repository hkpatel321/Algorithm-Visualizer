import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {BaseUrl} from '../../utils/BaseUrl.js';
function ChatHistory() {
  const [chatHistory, setChatHistory] = useState([]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/api/chat/getMessages`, 
        { withCredentials: true }
      );
      if (response.data.success) {
        setChatHistory(response.data.messages);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchChatHistory();
  }, [isAuthenticated, navigate]);

  const handleDelete = async (messageId) => {
    try {
      console.log('Deleting message:', messageId);
      const response = await axios.delete(
        `${BaseUrl}/api/chat/deleteMessage/${messageId}`,
        { withCredentials: true }
      );
      console.log('Delete response:', response.data);
      if (response.data.success) {
        fetchChatHistory(); // Refresh the chat history
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete all messages? This cannot be undone.')) {
      try {
        const response = await axios.delete(
          `${BaseUrl}/api/chat/deleteAllMessages`,
          { withCredentials: true }
        );
        if (response.data.success) {
          fetchChatHistory(); 
        }
      } catch (error) {
        console.error('Error deleting all messages:', error);
      }
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto bg-gray-800/50 rounded-xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Chat History</h2>
          {chatHistory.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="space-y-4">
          {chatHistory.map((message) => (
            <div
              key={message._id}  
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} group`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 relative ${
                  message.sender === 'user'
                    ? 'bg-purple-600/70 text-white'
                    : 'bg-gray-700/70 text-gray-100'
                } chat-message`}
              >
                <button
                  onClick={() => handleDelete(message._id)}
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1 text-xs transition-opacity"
                >
                  ×
                </button>
                <div
                  dangerouslySetInnerHTML={{ __html: message.text }}
                  className="prose prose-invert max-w-none"
                />
                <p className="text-xs opacity-50 mt-1">
                  {formatDate(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatHistory;
