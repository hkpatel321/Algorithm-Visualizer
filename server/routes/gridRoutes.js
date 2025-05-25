const express = require('express');
const router = express.Router();
const { userVerification } = require('../middlewares/AuthMiddleware');
const GridController = require('../controllers/GridController');

router.post('/save', userVerification, GridController.saveGrid);
router.get('/load', userVerification, GridController.loadGrids);

module.exports = router;
