"use client"

// @mui
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
// _mock
import { PRODUCT_CHECKOUT_STEPS } from "@/_mock/_product";
// components
import { useSettingsContext } from "@/components/settings";
import { useGetAddresses } from "@/services/user.service";
import useGetUser from "@/hooks/use-get-user";
//
import { useCheckoutContext } from "../context";
import CheckoutCart from "../checkout-cart";
import CheckoutSteps from "../checkout-steps";
import CheckoutPayment from "../checkout-payment";
import CheckoutOrderComplete from "../checkout-order-complete";
import CheckoutBillingAddress from "../checkout-billing-address";

// ----------------------------------------------------------------------

export default function CheckoutView() {
  const settings: any = useSettingsContext();
  const user = useGetUser()

  const checkout: any = useCheckoutContext();

  const {
    addresses
  } = useGetAddresses({
    userId: user?.id
  })

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"} sx={{ mb: 10 }}>
      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
        Checkout
      </Typography>

      <Grid
        container
        justifyContent={checkout.completed ? "center" : "flex-start"}
      >
        <Grid xs={12} md={8}>
          <CheckoutSteps
            activeStep={checkout.activeStep}
            steps={PRODUCT_CHECKOUT_STEPS}
          />
        </Grid>
      </Grid>

      {checkout.completed ? (
        <CheckoutOrderComplete
          open={checkout.completed}
          onReset={checkout.onReset}
          onDownloadPDF={() => {}}
        />
      ) : (
        <>
          {checkout.activeStep === 0 && <CheckoutCart />}

          {/* {checkout.activeStep === 1 && <CheckoutBillingAddress addresses={addresses}/>} */}
          <CheckoutBillingAddress addresses={addresses}/>

          {/* {checkout.activeStep === 2 && checkout.billing && <CheckoutPayment />} */}
        </>
      )}
    </Container>
  );
}
