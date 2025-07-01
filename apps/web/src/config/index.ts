import { paths } from "@/routes/paths";

export const PATH_AFTER_LOGIN = paths.home.root;
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const ASSETS_API = process.env.REACT_APP_ASSETS_API;
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// CLOUDINARY
export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET =
  process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// IMAGE_KIT
export const IMAGE_KIT_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_IMAGE_KIT_PUBLIC_KEY;
export const IMAGE_KIT_PRIVATE_KEY =
  process.env.NEXT_PUBLIC_IMAGE_KIT_PRIVATE_KEY;
export const IMAGE_KIT_URL_ENDPOINT =
  process.env.NEXT_PUBLIC_IMAGE_KIT_URL_ENDPOINT;
