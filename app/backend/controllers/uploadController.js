
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = req.file.path; // Cloudinary secure URL
    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Image upload failed' });
  }
};
