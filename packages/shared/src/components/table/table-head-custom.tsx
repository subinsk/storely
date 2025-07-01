import PropTypes from "prop-types";
// @mui
import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableHead from "@mui/material/TableHead";
import TableCell, { SortDirection } from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";

// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: "1px",
  height: "1px",
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  clip: "rect(0 0 0 0)",
};

// ----------------------------------------------------------------------

export default function TableHeadCustom({
  order,
  orderBy,
  rowCount = 0,
  headLabel,
  numSelected = 0,
  onSort,
  onSelectAllRows,
  sx,
}: {
  sx?: object;
  onSort: any;
  orderBy: string;
  headLabel: any;
  rowCount: number;
  numSelected: number;
  onSelectAllRows: any;
  order: string;
}) {
  return (
    <TableHead sx={sx}>
      <TableRow>
        {onSelectAllRows && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={!!numSelected && numSelected < rowCount}
              checked={!!rowCount && numSelected === rowCount}
              onChange={(event) => onSelectAllRows(event.target.checked)}
            />
          </TableCell>
        )}

        {headLabel.map(
          (
            headCell:
              | {
                  id: string;
                  align?: "center" | "right" | "left";
                  width?: string;
                  minWidth?: string;
                  label: string;
                }
              | any
          ) => (
            <TableCell
              key={headCell.id}
              align={headCell.align || "left"}
              sortDirection={
                orderBy === headCell.id
                  ? (order as SortDirection | undefined)
                  : false
              }
              sx={{ width: headCell.width, minWidth: headCell.minWidth }}
            >
              {onSort ? (
                <TableSortLabel
                  hideSortIcon
                  active={orderBy === headCell.id}
                  direction={
                    orderBy === headCell.id
                      ? (order as "asc" | "desc" | undefined)
                      : "asc"
                  }
                  onClick={() => onSort(headCell.id)}
                >
                  {headCell.label}

                  {orderBy === headCell.id ? (
                    <Box sx={{ ...visuallyHidden }}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              ) : (
                headCell.label
              )}
            </TableCell>
          )
        )}
      </TableRow>
    </TableHead>
  );
}

TableHeadCustom.propTypes = {
  sx: PropTypes.object,
  onSort: PropTypes.func,
  orderBy: PropTypes.string,
  headLabel: PropTypes.array,
  rowCount: PropTypes.number,
  numSelected: PropTypes.number,
  onSelectAllRows: PropTypes.func,
  order: PropTypes.oneOf(["asc", "desc"]),
};
