import PropTypes from "prop-types";
// @mui
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import TablePagination from "@mui/material/TablePagination";

interface TablePaginationCustomProps {
  dense: boolean;
  onChangeDense: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowsPerPageOptions?: number[];
  count: number; // Add count prop
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void; // Add onPageChange prop
  page: number; // Add page prop
  rowsPerPage: number; // Add rowsPerPage prop
  sx?: object;
  [x: string]: any;
}

export default function TablePaginationCustom({
  dense,
  onChangeDense,
  rowsPerPageOptions = [5, 10, 25],
  count,
  onPageChange,
  page,
  rowsPerPage,
  sx,
  ...other
}: TablePaginationCustomProps) {
  return (
    <Box sx={{ position: "relative", ...sx }}>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={count} // Pass count prop
        onPageChange={onPageChange} // Pass onPageChange prop
        page={page} // Pass page prop
        rowsPerPage={rowsPerPage} // Pass rowsPerPage prop
        sx={{
          borderTopColor: "transparent",
        }}
        {...other}
      />

      {onChangeDense && (
        <FormControlLabel
          label="Dense"
          control={<Switch checked={dense} onChange={onChangeDense} />}
          sx={{
            pl: 2,
            py: 1.5,
            top: 0,
            position: {
              sm: "absolute",
            },
          }}
        />
      )}
    </Box>
  );
}

TablePaginationCustom.propTypes = {
  dense: PropTypes.bool,
  onChangeDense: PropTypes.func.isRequired,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  sx: PropTypes.object,
};
