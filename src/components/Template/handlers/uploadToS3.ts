import axios from 'axios';

export async function uploadImageToS3(
  file: File,
  setProgress: (percent: number) => void
): Promise<string> {
  const { data: { url } } = await axios.get(
    `http://localhost:3001/get-presigned-url?filename=${file.name}`
  );

  await axios.put(url, file, {
    headers: { 'Content-Type': file.type },
    onUploadProgress: (event) => {
      const percent = Math.round((event.loaded * 100) / (event.total || 1));
      setProgress(percent);
    },
  });

  return url.split('?')[0]; // Return clean S3 URL
}
