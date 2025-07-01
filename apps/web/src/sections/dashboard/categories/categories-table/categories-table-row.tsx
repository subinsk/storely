import { usePopover } from "@/components/custom-popover";
import Iconify from "@/components/iconify";
import { Checkbox, IconButton, TableCell, TableRow } from "@mui/material";

export default function CategoriesTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: {
  row: any;
  selected: boolean;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
}) {
  const { name } = row;

  const popover = usePopover();
  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell>{name}</TableCell>
      <TableCell align="right" sx={{ px: 1, whiteSpace: "nowrap" }}>
        <IconButton
          color={popover.open ? "inherit" : "default"}
          onClick={popover.onOpen}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
