import { useState, useCallback } from "react";
import { Theme } from "@mui/material/styles";
// @mui
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
// components
import { Iconify } from "@storely/shared/components/iconify";
import { SearchNotFound } from "@storely/shared/components/search-not-found";
// types
import type { PaymentCard } from "@/types/payment";
//
import PaymentNewCardDialog from "./payment-new-card-dialog";
import PaymentCardItem from "./payment-card-item";

// ----------------------------------------------------------------------

interface PaymentCardListDialogProps {
  open: boolean;
  list: PaymentCard[];
  onClose: VoidFunction;
  selected: (id: string) => boolean;
  onSelect: (card: PaymentCard) => void;
}

interface FilterParams {
  inputData: PaymentCard[];
  query: string;
}

function applyFilter({ inputData, query }: FilterParams) {
  if (query) {
    const lowercaseQuery = query.toLowerCase();
    return inputData.filter(
      (card) =>
        card.cardNumber.toLowerCase().includes(lowercaseQuery) ||
        card.holderName.toLowerCase().includes(lowercaseQuery)
    );
  }

  return inputData;
}

export default function PaymentCardListDialog({
  open,
  list,
  onClose,
  selected,
  onSelect,
}: PaymentCardListDialogProps) {
  const [searchCard, setSearchCard] = useState("");
  const [showNewCardDialog, setShowNewCardDialog] = useState(false);

  const dataFiltered = applyFilter({
    inputData: list,
    query: searchCard,
  });

  const notFound = !dataFiltered.length && !!searchCard;

  const handleSearchCard = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCard(event.target.value);
  }, []);

  const handleSelectCard = useCallback(
    (card: PaymentCard) => {
      onSelect(card);
      setSearchCard("");
      onClose();
    },
    [onClose, onSelect]
  );

  const handleOpenNewCard = useCallback(() => {
    setShowNewCardDialog(true);
  }, []);

  const handleCloseNewCard = useCallback(() => {
    setShowNewCardDialog(false);
  }, []);

  const renderList = (
    <Stack spacing={2.5} sx={{ p: 3 }}>
      {dataFiltered.map((card) => (
        <Stack
          key={card.id}
          component="button"
          onClick={() => handleSelectCard(card)}
          sx={{
            p: 0,
            border: 0,
            width: 1,
            background: 'transparent',
            cursor: "pointer",
          }}
        >
          <PaymentCardItem
            card={card}
            sx={{
              ...(selected(card.id) && {
                boxShadow: (theme: Theme) => `0 0 0 2px ${theme.palette.text.primary}`,
              }),
            }}
          />
        </Stack>
      ))}
    </Stack>
  );

  return (
    <>
      <Dialog open={open} fullWidth maxWidth="sm">
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3 }}>
          <Typography variant="h6"> Cards </Typography>

          <Button
            size="small"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleOpenNewCard}
          >
            New Card
          </Button>
        </Stack>

        <Stack sx={{ px: 3 }}>
          <TextField
            value={searchCard}
            onChange={handleSearchCard}
            placeholder="Search card..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ color: "text.disabled" }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        {notFound ? (
          <SearchNotFound query={searchCard} sx={{ px: 3, pt: 5, pb: 10 }} />
        ) : (
          renderList
        )}
      </Dialog>

      <PaymentNewCardDialog
        open={showNewCardDialog}
        onClose={handleCloseNewCard}
        onSubmit={async (data) => {
          // Here we would handle adding a new card
          // For now just close the dialog
          handleCloseNewCard();
        }}
      />
    </>
  );
}
