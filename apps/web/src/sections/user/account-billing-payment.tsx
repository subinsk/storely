import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';

// hooks
import { useBoolean } from '@/hooks/use-boolean';
// components
import {Iconify} from'@storely/shared/components/iconify';
//
import PaymentCardItem from '../payment/payment-card-item';
import PaymentNewCardDialog from '../payment/payment-new-card-dialog';

// ----------------------------------------------------------------------

export default function AccountBillingPayment({ cards }:{
  cards: any;

}) {
  const newCard = useBoolean();

  return (
    <>
      <Card sx={{ my: 3 }}>
        <CardHeader
          title="Payment Method"
          action={
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={newCard.onTrue}
            >
              New Card
            </Button>
          }
        />

        <Box
          rowGap={2.5}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
          sx={{ p: 3 }}
        >
          {cards.map((card:any) => (
            <PaymentCardItem key={card.id} card={card} />
          ))}
        </Box>
      </Card>

      <PaymentNewCardDialog open={newCard.value} onClose={newCard.onFalse} />
    </>
  );
}

AccountBillingPayment.propTypes = {
  cards: PropTypes.array,
};
