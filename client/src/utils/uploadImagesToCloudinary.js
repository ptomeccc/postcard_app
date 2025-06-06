import { cloudinaryConfig } from "../config/cloudinaryConfig";

export const uploadImagesToCloudinary = async (photos) => {
  const uploadedUrls = [];

  for (const photo of photos) {
    if (!photo) {
      throw new Error("No photo provided");
    }

    if (
      !cloudinaryConfig ||
      !cloudinaryConfig.cloudName ||
      !cloudinaryConfig.uploadPreset
    ) {
      console.error("Current cloudinaryConfig:", cloudinaryConfig);
      throw new Error(
        "Missing Cloudinary configuration. Please check your cloudinaryConfig.js file."
      );
    }

    const formData = new FormData();
    formData.append("file", photo);
    formData.append("upload_preset", cloudinaryConfig.uploadPreset);
    formData.append("folder", cloudinaryConfig.folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    const optimizedUrl = data.secure_url.replace(
      "/upload/",
      "/upload/w_500,q_auto,f_auto/"
    );

    uploadedUrls.push(optimizedUrl);
  }

  return uploadedUrls;
};
