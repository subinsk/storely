import PropTypes from 'prop-types';
// @mui
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// utils
import { fDate } from '@storely/shared/utils/format-time';
import { fCurrency } from '@storely/shared/utils/format-number';
// hooks
import { useBoolean } from '@storely/shared/hooks';
// components
import {Iconify} from '@storely/shared/components/iconify';

// ----------------------------------------------------------------------

export default function AccountBillingHistory({ invoices }:{
  invoices: any;
}) {
  const showMore = useBoolean();

  return (
    <Card>
      <CardHeader title="Invoice History" />

      <Stack spacing={1.5} sx={{ px: 3, pt: 3 }}>
        {(showMore.value ? invoices : invoices.slice(0, 8)).map((invoice:any) => (
          <Stack key={invoice.id} direction="row" alignItems="center">
            <ListItemText
              primary={invoice.invoiceNumber}
              secondary={fDate(invoice.createdAt)}
              primaryTypographyProps={{
                typography: 'body2',
              }}
              secondaryTypographyProps={{
                mt: 0.5,
                component: 'span',
                typography: 'caption',
                color: 'text.disabled',
              }}
            />

            <Typography variant="body2" sx={{ textAlign: 'right', mr: 5 }}>
              {fCurrency(invoice.price)}
            </Typography>

            <Link color="inherit" underline="always" variant="body2" href="#">
              PDF
            </Link>
          </Stack>
        ))}

        <Divider sx={{ borderStyle: 'dashed' }} />
      </Stack>

      <Stack alignItems="flex-start" sx={{ p: 2 }}>
        <Button
          size="small"
          color="inherit"
          startIcon={
            <Iconify
              icon={showMore.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            />
          }
          onClick={showMore.onToggle}
        >
          {showMore.value ? `Show Less` : `Show More`}
        </Button>
      </Stack>
    </Card>
  );
}

AccountBillingHistory.propTypes = {
  invoices: PropTypes.array,
};
