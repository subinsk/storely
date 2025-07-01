import { paths } from "../routes/paths";

export const PATH_AFTER_LOGIN = paths.dashboard.root;
export const ASSETS_API = process.env.REACT_APP_ASSETS_API;
export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

// CLOUDINARY
export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET =
  process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// IMAGE_KIT - with runtime validation and debugging
const missingImageKitVars: string[] = [];

const IMAGE_KIT_PUBLIC_KEY_RAW = process.env.NEXT_PUBLIC_IMAGE_KIT_PUBLIC_KEY;
const IMAGE_KIT_PRIVATE_KEY_RAW = process.env.NEXT_PUBLIC_IMAGE_KIT_PRIVATE_KEY;
const IMAGE_KIT_URL_ENDPOINT_RAW = process.env.NEXT_PUBLIC_IMAGE_KIT_URL_ENDPOINT;

// Debug: Log all environment variables that start with NEXT_PUBLIC_
if (typeof window === 'undefined') {
  console.log('Environment variables debug:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('All NEXT_PUBLIC_ vars:', 
    Object.keys(process.env)
      .filter(key => key.startsWith('NEXT_PUBLIC_'))
      .map(key => `${key}=${process.env[key]}`)
  );
}

if (!IMAGE_KIT_PUBLIC_KEY_RAW) missingImageKitVars.push('NEXT_PUBLIC_IMAGE_KIT_PUBLIC_KEY');
if (!IMAGE_KIT_PRIVATE_KEY_RAW) missingImageKitVars.push('NEXT_PUBLIC_IMAGE_KIT_PRIVATE_KEY');
if (!IMAGE_KIT_URL_ENDPOINT_RAW) missingImageKitVars.push('NEXT_PUBLIC_IMAGE_KIT_URL_ENDPOINT');

if (missingImageKitVars.length > 0) {
  throw new Error(
    `Missing required ImageKit environment variables: ${missingImageKitVars.join(', ')}.\nPlease set them in your .env file.\nCurrent values: PUBLIC_KEY=${IMAGE_KIT_PUBLIC_KEY_RAW}, PRIVATE_KEY=${IMAGE_KIT_PRIVATE_KEY_RAW}, URL_ENDPOINT=${IMAGE_KIT_URL_ENDPOINT_RAW}\nWorking directory: ${process.cwd()}`
  );
}

export const IMAGE_KIT_PUBLIC_KEY = IMAGE_KIT_PUBLIC_KEY_RAW;
export const IMAGE_KIT_PRIVATE_KEY = IMAGE_KIT_PRIVATE_KEY_RAW;
export const IMAGE_KIT_URL_ENDPOINT = IMAGE_KIT_URL_ENDPOINT_RAW;
