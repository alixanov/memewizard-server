const Meme = require('../models/Meme');
const cloudinary = require('cloudinary').v2;

const publishMeme = async (req, res) => {
  const { image } = req.body;

  try {
    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: 'memes',
      resource_type: 'image',
    });

    const meme = new Meme({
      userId: req.user.id,
      image: uploadResult.secure_url,
    });

    await meme.save();

    res.status(201).json({ message: 'Meme published successfully', meme });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    if (err.http_code === 401) {
      return res.status(500).json({ message: 'Invalid Cloudinary credentials' });
    }
    res.status(500).json({ message: err.message || 'Server error' });
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
  console.log('Delete meme request:', { id, userId: req.user.id });

  try {
    const meme = await Meme.findById(id);
    if (!meme) {
      console.log('Meme not found:', id);
      return res.status(404).json({ message: 'Meme not found' });
    }

    if (meme.userId.toString() !== req.user.id) {
      console.log('Unauthorized delete attempt:', { memeUserId: meme.userId, requestingUserId: req.user.id });
      return res.status(403).json({ message: 'You are not authorized to delete this meme' });
    }

    const publicId = meme.image.split('/').pop().split('.')[0];
    console.log('Deleting Cloudinary image:', `memes/${publicId}`);
    await cloudinary.uploader.destroy(`memes/${publicId}`);

    await Meme.deleteOne({ _id: id });
    console.log('Meme deleted from MongoDB:', id);

    res.json({ message: 'Meme deleted successfully' });
  } catch (err) {
    console.error('Delete meme error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { publishMeme, getMyMemes, deleteMeme };