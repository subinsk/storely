import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "@/config";
import { Cloudinary } from "@cloudinary/url-gen";

export const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// const formData = new FormData();
// const file = data.image;

// formData.append("file", file);
// formData.append("upload_preset", `${CLOUDINARY_UPLOAD_PRESET}`);
// formData.append("cloud_name", `${CLOUDINARY_CLOUD_NAME}`);

// const response = await fetch(CLOUDINARY_API_URL, {
//   method: "POST",
//   body: formData,
// }).then((response) => {
//   return response.json();
// });

// imageUrl = response.secure_url;

// {"asset_id":"ee14d3fc5bc185247543faedb0ff9f43","public_id":"IMG_2076_neblhq","version":1714025175,"version_id":"88e205df9fca86d4f5d9176c3daa0d15","signature":"7b9de58e132ce039c02a9a763d176d3d031483b3","width":1192,"height":1294,"format":"jpg","resource_type":"image","created_at":"2024-04-25T06:06:15Z","tags":[],"bytes":375085,"type":"upload","etag":"ee1787eeb4e81e29297b26209d7fc22d","placeholder":false,"url":"http://res.cloudinary.com/dngbmzf6x/image/upload/v1714025175/IMG_2076_neblhq.jpg","secure_url":"https://res.cloudinary.com/dngbmzf6x/image/upload/v1714025175/IMG_2076_neblhq.jpg","folder":"","access_mode":"public","existing":false,"original_filename":"IMG_2076"}
