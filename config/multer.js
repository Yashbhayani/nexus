const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

/**
 * Generates Cloudinary storage configuration dynamically
 * @param {string} folderName - Folder name in Cloudinary
 * @param {object} req - Request object (optional)
 */
const getStorage = (folderName, req = {}) => {

  console.log('Generating storage for folder:', folderName, req.body);

  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder: folderName,
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      public_id: (file) => {
        const userName = req.user?.name || 'user';
        const timestamp = Date.now();

        // ✅ safely handle missing originalname
        const originalName = file.originalname || 'uploaded_file';
        const cleanFileName = originalName.split('.')[0].replace(/\s+/g, '_');

        return `${userName}_${timestamp}_${cleanFileName}`;
      },
    },
  });
};

module.exports = getStorage;
