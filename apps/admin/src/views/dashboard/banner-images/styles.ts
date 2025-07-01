import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const Parent = styled(Box)(({ theme }: { theme: any }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(12, 1fr)",
  gridTemplateRows: "repeat(6, 1fr)",
  gap: theme.spacing(1),
  height: 400,
  width: "100%",
}));

const BannerImageOne = styled(Box)(({ theme }: { theme: any }) => ({
  gridArea: "1 / 1 / 7 / 8",
  border: "1px dashed black",
  borderRadius: 4,
}));

const BannerImageTwo = styled(Box)(({ theme }: { theme: any }) => ({
  gridArea: "1 / 8 / 4 / 13",
  border: "1px dashed black",
  borderRadius: 4,
}));

const BannerImageThree = styled(Box)(({ theme }: { theme: any }) => ({
  gridArea: "4 / 8 / 7 / 13",
  border: "1px dashed black",
  borderRadius: 4,
}));

const UploadBoxContainer = styled(Box)(({ theme }: { theme: any }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  width: "100%",
  height: "100%",
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export {
  Parent,
  BannerImageOne,
  BannerImageTwo,
  BannerImageThree,
  UploadBoxContainer,
  VisuallyHiddenInput,
};
