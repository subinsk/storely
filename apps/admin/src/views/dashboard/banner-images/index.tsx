"use client";

import Iconify from "@/components/iconify";
import { Container, Stack, Typography } from "@mui/material";
import {
  Parent,
  BannerImageOne,
  BannerImageTwo,
  BannerImageThree,
} from "./styles";
import { useState } from "react";
import UploadBox from "./upload-box";

export default function BannerImagesView() {
  return (
    <Container maxWidth="xl">
      <Parent>
        <BannerImageOne>
          <UploadBox banner="one" />
        </BannerImageOne>
        <BannerImageTwo>
          <UploadBox banner="two" />
        </BannerImageTwo>
        <BannerImageThree>
          <UploadBox banner="three" />
        </BannerImageThree>
      </Parent>
    </Container>
  );
}
