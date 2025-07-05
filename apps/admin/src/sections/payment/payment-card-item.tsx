import { type PaymentCard } from "@/types/payment";
// @mui
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
// components
import { Label } from "@storely/shared/components/label";
import { Iconify } from "@storely/shared/components/iconify";
import CustomPopover from "@storely/shared/components/custom-popover";
import { usePopover } from "@storely/shared/components/custom-popover";

// ----------------------------------------------------------------------

interface PaymentCardItemProps {
  card: PaymentCard;
  onSetPrimary?: (cardId: string) => void;
  onEdit?: (card: PaymentCard) => void;
  onDelete?: (cardId: string) => void;
  sx?: any;
}

export default function PaymentCardItem({
  card,
  onSetPrimary,
  onEdit,
  onDelete,
  sx,
  ...other
}: PaymentCardItemProps) {
  const popover = usePopover();

  const handleSetPrimary = () => {
    if (onSetPrimary) {
      onSetPrimary(card.id);
    }
    popover.onClose();
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(card);
    }
    popover.onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(card.id);
    }
    popover.onClose();
  };

  return (
    <>
      <Stack
        spacing={1}
        component={Paper}
        variant="outlined"
        sx={{
          p: 2.5,
          width: 1,
          position: "relative",
          ...sx,
        }}
        {...other}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify
            icon={
              card.cardType === "visa" ? "logos:visa" : "logos:mastercard"
            }
            width={36}
          />

          {card.status === "active" && (
            <Label color="success">Active</Label>
          )}
          {card.status === "expired" && (
            <Label color="error">Expired</Label>
          )}
          {card.primary && <Label color="info">Default</Label>}
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">{card.holderName}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {card.maskedNumber}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            Expires: {card.expiryDate}
          </Typography>
        </Stack>

        <IconButton
          onClick={popover.onOpen}
          sx={{
            top: 8,
            right: 8,
            position: "absolute",
          }}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>

      <CustomPopover open={popover.open} onClose={popover.onClose}>
        {!card.primary && (
          <MenuItem onClick={handleSetPrimary} disabled={!onSetPrimary}>
            <Iconify icon="eva:star-fill" sx={{ mr: 1 }} />
            Set as primary
          </MenuItem>
        )}

        <MenuItem onClick={handleEdit} disabled={!onEdit}>
          <Iconify icon="solar:pen-bold" sx={{ mr: 1 }} />
          Edit
        </MenuItem>

        <MenuItem
          onClick={handleDelete}
          disabled={!onDelete}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}
