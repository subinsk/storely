"use client";

import CustomPopover, { usePopover } from "@storely/shared/components/custom-popover";
import {Iconify} from "@storely/shared/components/iconify";
import { fToNow } from "@storely/shared/utils/format-time";
import {
  Checkbox,
  IconButton,
  MenuItem,
  TableCell,
  TableRow,
} from "@mui/material";

export default function CategoriesTableRow({
  row,
  index,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onViewRow,
}: {
  row: any;
  index: number;
  selected: boolean;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
  onViewRow: () => void;
}) {
  const { name, createdAt, updatedAt, parent } = row;

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}
        <TableCell align="center">{index + 1}</TableCell>
        <TableCell sx={{
          cursor: 'pointer'
        }} onClick={onViewRow}>{name}</TableCell>
        <TableCell align="center">{parent?.name || "-"}</TableCell>
        <TableCell>{fToNow(createdAt)}</TableCell>
        <TableCell>{fToNow(updatedAt)}</TableCell>
        <TableCell align="right" sx={{ px: 1, whiteSpace: "nowrap" }}>
          <IconButton
            color={popover.open ? "inherit" : "default"}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      {popover.open && (
        <CustomPopover
          open={popover.open}
          onClose={popover.onClose}
          sx={{ width: 120 }}
        >
          <MenuItem onClick={onViewRow}>
            <Iconify icon="tabler:eye" />
            View
          </MenuItem>
          <MenuItem onClick={onEditRow}>
            <Iconify icon="eva:edit-2-fill" />
            Edit
          </MenuItem>
          <MenuItem onClick={onDeleteRow}>
            <Iconify icon="eva:trash-2-fill" />
            Delete
          </MenuItem>
        </CustomPopover>
      )}
    </>
  );
}
