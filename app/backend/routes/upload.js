const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// POST /api/upload — upload 1–5 images to Cloudinary, returns array of URLs
router.post('/', auth, upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const urls = req.files.map(f => f.path); // multer-storage-cloudinary puts the URL in .path
    res.json({ urls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

module.exports = router;
