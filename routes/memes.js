const express = require('express');
const router = express.Router();
const { publishMeme, getMyMemes, deleteMeme } = require('../controllers/memeController');
const auth = require('../middleware/authMiddleware');

router.post('/publish', auth, publishMeme);
router.get('/my-memes', auth, getMyMemes);
router.delete('/:id', auth, deleteMeme);

module.exports = router;