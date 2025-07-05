import { useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import InputAdornment from "@mui/material/InputAdornment";
import Dialog from "@mui/material/Dialog";
import LoadingButton from "@mui/lab/LoadingButton";
// components
import { Iconify } from "@storely/shared/components/iconify";
import { FormProvider, RHFTextField } from "@storely/shared/components/hook-form";
import CustomPopover, { usePopover } from "@storely/shared/components/custom-popover";

// ----------------------------------------------------------------------

const CARD_REGEX = /^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$/;
const CVV_REGEX = /^[0-9]{3,4}$/;
const EXPIRE_REGEX = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;

interface FormValuesProps {
  cardName: string;
  cardNumber: string;
  cardExpire: string;
  cardCvv: string;
}

const NewCardSchema = Yup.object().shape({
  cardName: Yup.string().required("Card holder name is required"),
  cardNumber: Yup.string()
    .required("Card number is required")
    .matches(CARD_REGEX, "Card number must be in format: XXXX XXXX XXXX XXXX"),
  cardExpire: Yup.string()
    .required("Expiration date is required")
    .matches(EXPIRE_REGEX, "Invalid expiration date (MM/YY)"),
  cardCvv: Yup.string()
    .required("CVV is required")
    .matches(CVV_REGEX, "CVV must be 3 or 4 digits"),
});

interface Props {
  open: boolean;
  onClose: VoidFunction;
  onSubmit?: (data: FormValuesProps) => void;
}

export default function PaymentNewCardDialog({
  open,
  onClose,
  onSubmit: onSubmitProp,
}: Props) {
  const popover = usePopover();
  const [showCvv, setShowCvv] = useState(false);

  const defaultValues = {
    cardName: "",
    cardNumber: "",
    cardExpire: "",
    cardCvv: "",
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewCardSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      // Remove spaces from card number before submitting
      const formattedData = {
        ...data,
        cardNumber: data.cardNumber.replace(/\s/g, ""),
      };

      if (onSubmitProp) {
        await onSubmitProp(formattedData);
      }

      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Dialog open={open} fullWidth maxWidth="sm">
        <DialogTitle>Add New Card</DialogTitle>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Stack spacing={3} sx={{ py: 2 }}>
              <RHFTextField name="cardName" label="Card Holder Name" />

              <RHFTextField
                name="cardNumber"
                label="Card Number"
                placeholder="XXXX XXXX XXXX XXXX"
                InputProps={{
                  endAdornment: (
                    <Stack direction="row" spacing={1}>
                      <Iconify icon="logos:mastercard" width={24} />
                      <Iconify icon="logos:visa" width={24} />
                    </Stack>
                  ),
                }}
              />

              <Stack direction="row" spacing={2}>
                <RHFTextField
                  name="cardExpire"
                  label="Expiration Date"
                  placeholder="MM/YY"
                />

                <RHFTextField
                  name="cardCvv"
                  label="CVV/CVC"
                  placeholder="***"
                  type={showCvv ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowCvv(!showCvv)} edge="end">
                          <Iconify
                            icon={showCvv ? "eva:eye-fill" : "eva:eye-off-fill"}
                          />
                        </IconButton>
                        <IconButton onClick={popover.onOpen} edge="end">
                          <Iconify icon="eva:info-outline" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button color="inherit" variant="outlined" onClick={onClose}>
              Cancel
            </Button>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Add Card
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </Dialog>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-center"
        sx={{ maxWidth: 200, typography: "body2", textAlign: "center" }}
      >
        Three or four digit number on the back of your card
      </CustomPopover>
    </>
  );
}
