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

const deleteMeme = async (req, res) => {
  const { id } = req.params;

  try {
    const meme = await Meme.findById(id);
    if (!meme) {
      return res.status(404).json({ message: 'Meme not found' });
    }

    if (meme.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this meme' });
    }

    await Meme.deleteOne({ _id: id });
    res.json({ message: 'Meme deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { publishMeme, getMyMemes, deleteMeme };