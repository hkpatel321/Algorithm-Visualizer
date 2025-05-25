const express = require('express');
const { saveMessage, getMessages, generateResponse, deleteMessage, deleteAllMessages } = require('../controllers/ChatController');
const { userVerification } = require('../middlewares/AuthMiddleware');
const { getDashboardData } = require('../controllers/AuthController');

const router = express.Router();

router.post('/saveMessage', userVerification, saveMessage);
router.get('/getMessages', userVerification, getMessages);
router.post('/generateResponse', userVerification, generateResponse);
router.delete('/deleteMessage/:messageId', userVerification, deleteMessage);
router.delete('/deleteAllMessages', userVerification, deleteAllMessages);
router.get('/dashboard', userVerification, getDashboardData);

module.exports = router;
