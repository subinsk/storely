import React from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
// @mui
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
// assets
import { UploadIllustration } from "../../assets/illustrations";
//
import {Iconify} from "../iconify";
//
import RejectionFiles from "./errors-rejection-files";
import MultiFilePreview from "./preview-multi-file";
import SingleFilePreview from "./preview-single-file";

// ----------------------------------------------------------------------

export interface UploadProps {
  disabled?: boolean;
  multiple?: boolean;
  error?: boolean;
  helperText?: React.ReactNode;
  file?: File | string | null;
  files?: (File | string)[];
  onDrop?: (acceptedFiles: File[]) => void;
  onDelete?: () => void;
  onRemove?: (file: File | string) => void;
  onRemoveAll?: () => void;
  onUpload?: () => void;
  thumbnail?: boolean;
  sx?: any;
  accept?: Record<string, string[]>;
  placeholder?: string;
  [key: string]: any;
}

export default function Upload({
  disabled,
  multiple = false,
  error,
  helperText,
  //
  file,
  onDelete,
  //
  files,
  thumbnail,
  onUpload,
  onRemove,
  onRemoveAll,
  sx,
  placeholder,
  ...other
}: UploadProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple,
    disabled,
    ...other,
  });

  const hasFile = !!file && !multiple;

  const hasFiles = !!files && multiple && !!files.length;

  const hasError = isDragReject || !!error;

  const renderPlaceholder = (
    <Stack
      spacing={3}
      alignItems="center"
      justifyContent="center"
      flexWrap="wrap"
    >
      <UploadIllustration sx={{ width: 1, maxWidth: 200 }} />
      <Stack spacing={1} sx={{ textAlign: "center" }}>
        <Typography variant="h6">Drop or Select file</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {placeholder || "Drop files here or click"}
          <Box
            component="span"
            sx={{
              mx: 0.5,
              color: "primary.main",
              textDecoration: "underline",
            }}
          >
            browse
          </Box>
          through your machine
        </Typography>
      </Stack>
    </Stack>
  );

  const renderSinglePreview = (
    <SingleFilePreview
      imgUrl={typeof file === "string" ? file : (file as any)?.preview}
    />
  );

  const removeSinglePreview = hasFile && onDelete && (
    <IconButton
      size="small"
      onClick={onDelete}
      aria-label="Remove uploaded file"
      sx={{
        top: 16,
        right: 16,
        zIndex: 9,
        position: "absolute",
        color: (theme) => alpha(theme.palette.common.white, 0.8),
        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
        "&:hover": {
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
        },
      }}
    >
      <Iconify icon="mingcute:close-line" width={18} />
    </IconButton>
  );

  const renderMultiPreview = hasFiles && (
    <>
      <Box sx={{ my: 3 }}>
        <MultiFilePreview
          files={files || []}
          thumbnail={thumbnail || false}
          onRemove={onRemove as any}
        />
      </Box>

      <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
        {onRemoveAll && (
          <Button
            color="inherit"
            variant="outlined"
            size="small"
            onClick={onRemoveAll}
          >
            Remove All
          </Button>
        )}

        {onUpload && (
          <Button
            size="small"
            variant="contained"
            onClick={onUpload}
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
          >
            Upload
          </Button>
        )}
      </Stack>
    </>
  );

  return (
    <Box sx={{ width: 1, position: "relative", ...sx }}>
      <Box
        {...getRootProps()}
        sx={{
          p: 5,
          outline: "none",
          borderRadius: 1,
          cursor: "pointer",
          overflow: "hidden",
          position: "relative",
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
          border: (theme) =>
            `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
          transition: (theme) =>
            theme.transitions.create(["opacity", "padding"]),
          "&:hover": {
            opacity: 0.72,
          },
          ...(isDragActive && {
            opacity: 0.72,
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: "none",
          }),
          ...(hasError && {
            color: "error.main",
            borderColor: "error.main",
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
          }),
          ...(hasFile && {
            padding: "24% 0",
          }),
        }}
      >
        <input {...getInputProps()} aria-label="File upload input" />

        {hasFile ? renderSinglePreview : renderPlaceholder}
      </Box>

      {removeSinglePreview}

      {helperText && (
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="caption"
            color={hasError ? "error" : "text.secondary"}
          >
            {helperText}
          </Typography>
        </Box>
      )}

      <RejectionFiles fileRejections={fileRejections as FileRejection[]} />

      {renderMultiPreview}
    </Box>
  );
}
