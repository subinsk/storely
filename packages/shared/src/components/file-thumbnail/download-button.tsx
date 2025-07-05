import PropTypes from "prop-types";
// @mui
import { SxProps, Theme, useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
// theme
import { bgBlur } from "../../theme/css";
//
import {Iconify} from "../iconify";
import { MouseEventHandler } from "react";

// ----------------------------------------------------------------------

interface DownloadButtonProps {
  onDownload?: MouseEventHandler<HTMLButtonElement>;
  sx?: SxProps<Theme>;
}

export default function DownloadButton({
  onDownload,
  sx,
}: DownloadButtonProps) {
  const theme = useTheme();

  return (
    <IconButton
      onClick={onDownload}
      sx={{
        p: 0,
        top: 0,
        right: 0,
        width: 1,
        height: 1,
        zIndex: 9,
        opacity: 0,
        position: "absolute",
        borderRadius: "unset",
        justifyContent: "center",
        bgcolor: "grey.800",
        color: "common.white",
        transition: theme.transitions.create(["opacity"]),
        "&:hover": {
          opacity: 1,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          backgroundColor: `${theme.palette.grey[900]}CC`,
        },
        ...sx,
      } as any}
    >
      <Iconify icon="eva:arrow-circle-down-fill" width={24} />
    </IconButton>
  );
}

DownloadButton.propTypes = {
  onDownload: PropTypes.func,
  sx: PropTypes.any,
};
