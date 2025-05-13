export const uploadImagesToCloudinary = async (photos) => {
  const uploadedUrls = [];

  for (const photo of photos) {
    const formData = new FormData();
    formData.append("file", photo);
    formData.append("upload_preset", "postcard_preset");
    formData.append("folder", "postcards");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
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
