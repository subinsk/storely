import { forwardRef } from "react";
// @mui
import Box from "@mui/material/Box";

// ----------------------------------------------------------------------

const SvgColor = forwardRef(function SvgColor(
  { src, sx, ...other }: { src: string; sx?: object },
  ref
) {
  return (
    <Box
      component="span"
      className="svg-color"
      ref={ref}
      sx={{
        width: 24,
        height: 24,
        display: "inline-block",
        bgcolor: "currentColor",
        mask: `url(${src}) no-repeat center / contain`,
        WebkitMask: `url(${src}) no-repeat center / contain`,
        ...sx,
      }}
      {...other}
    />
  );
});

SvgColor.displayName = "SvgColor";

export default SvgColor;
