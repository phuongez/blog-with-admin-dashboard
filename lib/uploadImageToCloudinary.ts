export async function uploadImageToCloudinary(
  file: File
): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_upload"); // preset của bạn

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/ds30pv4oa/image/upload", // thay bằng cloud_name của bạn
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  return data.secure_url ?? null;
}
