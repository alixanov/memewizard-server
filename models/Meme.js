const mongoose = require('mongoose');

const memeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image: {
      type: String, // Store Cloudinary URL
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Meme', memeSchema);