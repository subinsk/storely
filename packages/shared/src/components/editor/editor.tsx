"use client";

import "../../utils/highlight";
import dynamic from "next/dynamic";

// @mui
import { alpha } from "@mui/material/styles";
//
import { StyledEditor } from "./styles";
import Toolbar, { formats } from "./toolbar";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// ----------------------------------------------------------------------

export default function Editor({
  id = "minimal-quill",
  error,
  simple = false,
  helperText,
  sx,
  ...other
}: {
  id?: string;
  error?: boolean | undefined;
  simple?: boolean;
  helperText?: React.ReactNode;
  sx?: object;
  [key: string]: any;
}) {
  const modules = {
    toolbar: {
      container: `#${id}`,
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
    syntax: true,
    clipboard: {
      matchVisual: false,
    },
  };

  return (
    <>
      <StyledEditor
        sx={{
          ...(error && {
            border: (theme) => `solid 1px ${theme.palette.error.main}`,
            "& .ql-editor": {
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
            },
          }),
          ...sx,
        }}
      >
        <Toolbar id={id} isSimple={simple} />

        <ReactQuill
          modules={modules}
          formats={formats}
          placeholder="Write something awesome..."
          {...other}
        />
      </StyledEditor>

      {helperText && helperText}
    </>
  );
}
