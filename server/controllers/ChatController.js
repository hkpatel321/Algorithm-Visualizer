const ChatMessage = require('../models/ChatMessage');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const ChatController = {};

ChatController.saveMessage = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { message, sender } = req.body;
    const userId = req.user.id;
    console.log('Saving message:', { userId, message, sender });

    const chatMessage = new ChatMessage({ userId, message, sender });
    await chatMessage.save();

    console.log('Message saved successfully');
    res.status(201).json({ success: true, message: 'Message saved successfully' });
  } catch (error) {
    console.error('Error in saveMessage:', error); 
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

ChatController.getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await ChatMessage.find({ userId }).sort({ timestamp: 1 });
    
    const formattedMessages = messages.map(msg => ({
      _id: msg._id,      
      text: msg.message,
      sender: msg.sender,
      timestamp: msg.timestamp
    }));

    res.status(200).json({ success: true, messages: formattedMessages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

ChatController.generateResponse = async (req, res) => {
  try {
    
    const { message } = req.body;
    console.log('Received message:', message); 
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    console.log('Generated result:', result);
    const response = await result.response;
    let text = response.text();

    
    text = text
     
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
        return `<div class="bg-gray-800 rounded-lg p-4 my-4">
          ${lang ? `<div class="text-sm text-gray-400 mb-2">${lang}</div>` : ''}
          <pre><code class="text-gray-100">${code.trim()}</code></pre>
        </div>`;
      })
      // Convert ** to proper HTML bold tags
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert numbered lists (e.g., 1., 2.) to proper HTML ordered lists
      .replace(/(\d+\.\s+(.*?)(\n|$))+/g, (match) => {
        const items = match.trim().split('\n').map(item => 
          `<li>${item.replace(/^\d+\.\s+/, '')}</li>`
        ).join('');
        return `<ol>${items}</ol>`;
      })
      // Convert bullet points to proper HTML unordered lists
      .replace(/(\*\s+(.*?)(\n|$))+/g, (match) => {
        const items = match.trim().split('\n').map(item => 
          `<li>${item.replace(/^\*\s+/, '')}</li>`
        ).join('');
        return `<ul>${items}</ul>`;
      })
      // Convert headings
      .replace(/^(#+)\s*(.*?)$/gm, (_, hashes, content) => {
        const level = hashes.length;
        return `<h${level}>${content}</h${level}>`;
      })
      // Add paragraph tags to text blocks
      .replace(/([^\n]+)\n\n/g, '<p>$1</p>')
      // Add line breaks for single newlines
      .replace(/\n(?!\n)/g, '<br>');

    res.status(200).json({ success: true, message: text });
  } catch (error) {
    console.error('Error in generateResponse:', error); // Log the error
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

ChatController.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;
    
    const message = await ChatMessage.findOneAndDelete({
      _id: messageId,
      userId: userId
    });

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

ChatController.deleteAllMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await ChatMessage.deleteMany({ userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'No messages found' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'All messages deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = ChatController;