const express = require('express');
const router = express.Router();
const { publishMeme, getMyMemes } = require('../controllers/memeController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/publish', authMiddleware, publishMeme);
router.get('/my-memes', authMiddleware, getMyMemes);

module.exports = router;