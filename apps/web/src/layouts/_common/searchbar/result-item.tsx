// @mui
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
// components
import Label from "@storely/shared/components/label";

// ----------------------------------------------------------------------

export default function ResultItem({
  title,
  path,
  groupLabel,
  onClickItem,
}: {
  title: any;
  path: any;
  groupLabel: any;
  onClickItem: any;
}) {
  return (
    <ListItemButton
      onClick={onClickItem}
      sx={{
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "transparent",
        borderBottomColor: (theme) => theme.palette.divider,
        "&:hover": {
          borderRadius: 1,
          borderColor: (theme) => theme.palette.primary.main,
          backgroundColor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.hoverOpacity
            ),
        },
      }}
    >
      <ListItemText
        primaryTypographyProps={{
          typography: "subtitle2",
          sx: { textTransform: "capitalize" },
        }}
        secondaryTypographyProps={{ typography: "caption" }}
        primary={title.map(
          (part: { text: any; highlight: any }, index: number) => (
            <Box
              key={index}
              component="span"
              sx={{
                color: part.highlight ? "primary.main" : "text.primary",
              }}
            >
              {part.text}
            </Box>
          )
        )}
        secondary={path.map(
          (part: { text: any; highlight: any }, index: number) => (
            <Box
              key={index}
              component="span"
              sx={{
                color: part.highlight ? "primary.main" : "text.secondary",
              }}
            >
              {part.text}
            </Box>
          )
        )}
      />

      {groupLabel && <Label color="info">{groupLabel}</Label>}
    </ListItemButton>
  );
}
