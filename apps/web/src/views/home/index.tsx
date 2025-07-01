import BannerImages from "@/sections/home";
import { Stack } from "@mui/material";
import TopPicks from "@/sections/home/top-picks";
import Image from "@/components/image";

export default function HomeView() {
  // hooks
  return (
    <Stack width="100%">
      <BannerImages />
      <TopPicks />
      <Image src="/assets/images/banners/banner.jpg" alt="banner-images" />
    </Stack>
  );
}
