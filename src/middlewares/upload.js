const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure Multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const timestamp = Date.now();
    const itemId = req.params.itemId || 'unknown'; // Default fallback if id is missing
    return {
      folder: 'usell-item-images', // Folder in Cloudinary
      public_id: `${timestamp}-${itemId}`, // Custom naming
      allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed formats
    };
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'), false);
    } else {
      cb(null, true);
    }
  },
});

// Middleware to handle single file uploads
const handleImageUpload = (req, res, next) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err) {
      return res.status(422).json({ code: 422, message: err.message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(422).json({ code: 422, message: 'No images provided' });
    }
    next();
  });
};

module.exports = handleImageUpload;