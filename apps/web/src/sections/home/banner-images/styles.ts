"use client";

import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const Parent = styled(Box)(({ theme }: { theme: any }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(12, 1fr)",
  gridTemplateRows: "repeat(6, 1fr)",
  gap: theme.spacing(1),
  height: 400,
  width: "100%",
  padding: theme.spacing(1),
}));

const BannerImageOne = styled(Box)(({ theme }: { theme: any }) => ({
  gridArea: "1 / 1 / 7 / 8",
}));

const BannerImageTwo = styled(Box)(({ theme }: { theme: any }) => ({
  gridArea: "1 / 8 / 4 / 13",
}));

const BannerImageThree = styled(Box)(({ theme }: { theme: any }) => ({
  gridArea: "4 / 8 / 7 / 13",
}));

export { Parent, BannerImageOne, BannerImageTwo, BannerImageThree };
