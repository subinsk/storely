import PropTypes from "prop-types";
// @mui
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
// components
import {Iconify} from"@storely/shared/components/iconify";
import CustomPopover, { usePopover } from "@storely/shared/components/custom-popover";

// ----------------------------------------------------------------------

export default function ProductSort({
  sort,
  onSort,
  sortOptions,
}: {
  sort: string;
  onSort: (value: string) => void;
  sortOptions: { value: string; label: string }[];
}) {
  const popover = usePopover();

  const sortLabel = sortOptions.find((option) => option.value === sort)?.label;

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={popover.onOpen}
        endIcon={
          <Iconify
            icon={
              popover.open
                ? "eva:arrow-ios-upward-fill"
                : "eva:arrow-ios-downward-fill"
            }
          />
        }
        sx={{ fontWeight: "fontWeightSemiBold" }}
      >
        Sort By:
        <Box component="span" sx={{ ml: 0.5, fontWeight: "fontWeightBold" }}>
          {sortLabel}
        </Box>
      </Button>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{ width: 140 }}
      >
        {sortOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === sort}
            onClick={() => {
              popover.onClose();
              onSort(option.value);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}

ProductSort.propTypes = {
  onSort: PropTypes.func,
  sort: PropTypes.string,
  sortOptions: PropTypes.array,
};
