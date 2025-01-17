import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
  file,
  folder = "linkedin-clone",
  resourceType = "image"
) => {
  try {
    const uploadOptions = {
      folder,
      resource_type: resourceType,
      // Add max file size limit (in bytes)
      max_file_size: 50 * 1024 * 1024, // 50MB
      
      // Compression and quality settings
      transformation: [
        { quality: "auto:low" }, 
        { fetch_format: "auto" }
      ],
    };

    const result = await cloudinary.uploader.upload(file, uploadOptions);
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload to Cloudinary");
  }
};

export const deleteFromCloudinary = async (
  publicId,
  resourceType = "image"
) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    throw new Error("Failed to delete from Cloudinary");
  }
};

export default cloudinary;
