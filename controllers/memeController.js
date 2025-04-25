const Meme = require('../models/Meme');

const publishMeme = async (req, res) => {
  const { image } = req.body;

  try {
    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const meme = new Meme({
      userId: req.user.id,
      image,
    });

    await meme.save();

    res.status(201).json({ message: 'Meme published successfully', meme });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyMemes = async (req, res) => {
  try {
    const memes = await Meme.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(memes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { publishMeme, getMyMemes };