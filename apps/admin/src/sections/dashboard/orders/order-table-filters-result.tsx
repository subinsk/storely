// @mui
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

// components
import {Iconify} from "@storely/shared/components/iconify";
import { shortDateLabel } from "@storely/shared/components/custom-date-range-picker";

// ----------------------------------------------------------------------

export default function OrderTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  results,
  ...other
}: {
  filters: any;
  onFilters: any;
  onResetFilters: any;
  results: any;
  [x: string]: any;
}) {
  const shortLabel = shortDateLabel(filters.startDate, filters.endDate);

  const handleRemoveStatus = () => {
    onFilters("status", "all");
  };

  const handleRemoveDate = () => {
    onFilters("startDate", null);
    onFilters("endDate", null);
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: "body2" }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: "text.secondary", ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack
        flexGrow={1}
        spacing={1}
        direction="row"
        flexWrap="wrap"
        alignItems="center"
      >
        {filters.status !== "all" && (
          <Block label="Status:">
            <Chip
              size="small"
              label={filters.status}
              onDelete={handleRemoveStatus}
            />
          </Block>
        )}

        {filters.startDate && filters.endDate && (
          <Block label="Date:">
            <Chip size="small" label={shortLabel} onDelete={handleRemoveDate} />
          </Block>
        )}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function Block({
  label,
  children,
  sx,
  ...other
}: {
  label: string;
  children: React.ReactNode;
  sx?: any;
}) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: "hidden",
        borderStyle: "dashed",
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: "subtitle2" }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
