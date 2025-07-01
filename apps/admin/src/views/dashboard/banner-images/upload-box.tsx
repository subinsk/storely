import { Box, Stack, Typography } from "@mui/material";
import { ReactNode, useRef, useState } from "react";
import { UploadBoxContainer, VisuallyHiddenInput } from "./styles";
import Iconify from "@/components/iconify";
import Image from "@/components/image";
import { IKImage, IKUpload } from "imagekitio-react";
import { IMAGE_KIT_URL_ENDPOINT } from "@/config";

export default function UploadBox({
  banner,
}: {
  banner: "one" | "two" | "three";
}) {
  // ref
  const ikUploadRef = useRef<
    HTMLInputElement & { upload: (file: File) => void }
  >(null);

  // states
  const [bannerImage, setBannerImage] = useState<
    (File & { preview: string }) | null
  >(null);
  const [showBannerImage, setShowBannerImage] = useState<boolean>(true);
  const [showOptions, setShowOptions] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // functions
  const handleBannerImage = (e: any) => {
    const file = e.target.files[0];

    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    if (file) {
      setBannerImage(newFile);
    }
  };

  const onError = (err: any) => {
    setIsUploading(false);
    console.log("Error", err);
  };

  const onSuccess = (res: any) => {
    setIsUploading(false);
    console.log("Success", res);
  };

  const onUploadProgress = (progress: any) => {
    console.log("Progress", progress);
  };

  const onUploadStart = (evt: any) => {
    handleBannerImage(evt);
    setIsUploading(true);
    console.log("Start", evt);
  };

  return (
    <UploadBoxContainer
      onMouseEnter={() => {
        setShowOptions(true);
      }}
      onMouseLeave={() => {
        setShowOptions(false);
      }}
    >
      {showBannerImage ? (
        <Stack
          position="relative"
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="center"
        >
          {showOptions && (
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={1}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1,
              }}
              onClick={() => {}}
            >
              <Iconify icon="bi:trash" width={40} color="#ffffff" />
              <Typography variant="body1" color="common.white">
                Remove
              </Typography>
            </Stack>
          )}
          <Image
            src={`${IMAGE_KIT_URL_ENDPOINT}/furnerio/banner-images/banner-image-${banner}`}
            onError={() => {
              setShowBannerImage(false);
            }}
            alt={`banner ${banner}`}
          />
        </Stack>
      ) : (
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={1}
          component="label"
          sx={{
            cursor: "pointer",
          }}
          width="100%"
          height="100%"
        >
          <Iconify icon="bi:cloud-upload" width={60} />
          <Typography variant="body1">{`Upload banner ${banner}`}</Typography>

          <IKUpload
            ref={ikUploadRef}
            fileName={`banner-image-${banner}`}
            isPrivateFile={false}
            useUniqueFileName={false}
            folder="/furnerio/banner-images"
            style={{
              display: "none",
            }}
            overwriteFile
            overwriteAITags
            overwriteTags
            overwriteCustomMetadata
            onError={onError}
            onSuccess={onSuccess}
            onUploadProgress={onUploadProgress}
            onUploadStart={onUploadStart}
          />
        </Stack>
      )}
    </UploadBoxContainer>
  );
}
