import Image from "@/components/image";
import { IMAGE_KIT_URL_ENDPOINT } from "@/config";

export default function ImageBox({ banner }: { banner: string }) {
  return (
    <Image
      src={`${IMAGE_KIT_URL_ENDPOINT}/furnerio/banner-images/banner-image-${banner}`}
      alt={`banner ${banner}`}
    />
  );
}
