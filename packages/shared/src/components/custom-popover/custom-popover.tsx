// @mui
import { menuItemClasses } from "@mui/material/MenuItem";
import Popover, { PopoverOrigin } from "@mui/material/Popover";
//
import { getPosition } from "./utils";
import { StyledArrow } from "./styles";

// ----------------------------------------------------------------------

export default function CustomPopover({
  open,
  children,
  arrow = "top-right",
  hiddenArrow,
  sx,
  ...other
}: {
  open: any;
  children: any;               
  arrow?: string;
  hiddenArrow?: boolean;
  sx?: any;
  [key: string]: any;
}) {
  const { style, anchorOrigin, transformOrigin } = getPosition(
    arrow as
      | "top-right"
      | "top-left"
      | "top-center"
      | "bottom-left"
      | "bottom-center"
      | "bottom-right"
      | "left-top"
      | "left-center"
      | "left-bottom"
      | "right-top"
      | "right-center"
      | "right-bottom"
      | undefined
  );

  return (
    <Popover
      open={Boolean(open)}
      anchorEl={open}
      anchorOrigin={anchorOrigin as PopoverOrigin}
      transformOrigin={transformOrigin as PopoverOrigin}
      slotProps={{
        paper: {
          sx: {
            width: "auto",
            overflow: "inherit",
            ...style,
            [`& .${menuItemClasses.root}`]: {
              "& svg": {
                mr: 2,
                flexShrink: 0,
              },
            },
            ...sx,
          },
        },
      }}
      {...other}
    >
      {!hiddenArrow && <StyledArrow arrow={arrow || "top-right"} />}

      {children}
    </Popover>
  );
}
