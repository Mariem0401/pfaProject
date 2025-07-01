const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dkwwvoes5",
  api_key: process.env.CLOUDINARY_API_KEY || "178799684769726",
  api_secret: process.env.CLOUDINARY_API_SECRET || "GQVy6h_YLTuCiu8V2NmItS18PwI",
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    return {
      folder: "adoptiPet",
      allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"],
      resource_type: "auto",
      transformation: [
        { width: 800, height: 800, crop: "limit" }, // Resize images
        { quality: "auto:good" }, // Optimize quality
      ],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, GIF, and WEBP images are allowed"), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for files
    fieldSize: 2 * 1024 * 1024, // 2MB limit for fields (e.g., healthRecords)
    fields: 100, // Allow up to 100 fields
    files: 1, // Allow only one file
  },
});

// Utility function to delete images
const deleteFromCloudinary = async (imageUrl) => {
  try {
    const publicId = extractPublicId(imageUrl);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
      console.log(`Deleted image from Cloudinary: ${publicId}`);
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
};

// Helper to extract public ID from Cloudinary URL
const extractPublicId = (url) => {
  if (!url) return null;
  const matches = url.match(/adoptiPet\/([^/]+)/);
  return matches ? `adoptiPet/${matches[1].split(".")[0]}` : null; // Remove file extension
};

module.exports = {
  cloudinary,
  upload,
  deleteFromCloudinary,
  extractPublicId,
};