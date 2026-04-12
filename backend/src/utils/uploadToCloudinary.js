const cloudinary = require('../config/cloudinary');

/**
 * Upload image to Cloudinary from base64 string or URL
 * @param {string} imageData - Base64 string or image URL
 * @param {string} folder - Cloudinary folder name (default: 'employees')
 * @returns {Promise<string>} - Cloudinary URL of uploaded image
 */
async function uploadToCloudinary(imageData, folder = 'employees') {
  try {
    // Check if imageData is already a URL (http/https)
    if (imageData && (imageData.startsWith('http://') || imageData.startsWith('https://'))) {
      return imageData; // Already a URL, return as is
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(imageData, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 500, height: 500, crop: 'limit' },
        { quality: 'auto' }
      ]
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

module.exports = { uploadToCloudinary };
