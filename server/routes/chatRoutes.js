const express = require('express');
const { saveMessage, getMessages, generateResponse, deleteMessage, deleteAllMessages } = require('../controllers/ChatController');
const { userVerification } = require('../middlewares/AuthMiddleware');

const router = express.Router();

router.post('/saveMessage', userVerification, saveMessage);
router.get('/getMessages', userVerification, getMessages);
router.post('/generateResponse', userVerification, generateResponse);
router.delete('/deleteMessage/:messageId', userVerification, deleteMessage);
router.delete('/deleteAllMessages', userVerification, deleteAllMessages);

module.exports = router;
