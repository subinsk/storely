import {
  API_URL,
  IMAGE_KIT_PRIVATE_KEY,
  IMAGE_KIT_PUBLIC_KEY,
  IMAGE_KIT_URL_ENDPOINT,
} from "@/config";
import ImageKit from "imagekit";

export const imagekit = new ImageKit({
  urlEndpoint: IMAGE_KIT_URL_ENDPOINT!,
  publicKey: IMAGE_KIT_PUBLIC_KEY!,
  privateKey: IMAGE_KIT_PRIVATE_KEY!,
});

export const imageKitAuthenticator = async () => {
  try {
    const response = await fetch(`${API_URL}/imagekit/auth`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

export const imageKitLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  if (src[0] === "/") src = src.slice(1);
  const params = [`w-${width}`];
  if (quality) {
    params.push(`q-${quality}`);
  }
  const paramsString = params.join(",");
  var urlEndpoint = `${IMAGE_KIT_URL_ENDPOINT}`;
  if (urlEndpoint[urlEndpoint.length - 1] === "/")
    urlEndpoint = urlEndpoint.substring(0, urlEndpoint.length - 1);

  return `${urlEndpoint}/${src}?tr=${paramsString}`;
};
