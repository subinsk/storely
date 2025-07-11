import PropTypes from 'prop-types';
// @mui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// components
import Scrollbar from '@storely/shared/components/scrollbar';
import { TableHeadCustom } from '@storely/shared/components/table';
//
import CheckoutCartProduct from './checkout-cart-product';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'product', label: 'Product' },
  { id: 'price', label: 'Price' },
  { id: 'quantity', label: 'Quantity' },
  { id: 'totalAmount', label: 'Total Price', align: 'right' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function CheckoutCartProductList({
  products,
  onDelete,
  onIncreaseQuantity,
  onDecreaseQuantity,
}:{
  products: any
  onDelete: any
  onIncreaseQuantity: any
  onDecreaseQuantity: any
}) {
  return (
    <TableContainer sx={{ overflow: 'unset' }}>
      <Scrollbar>
        <Table sx={{ minWidth: 720 }}>
          <TableHeadCustom headLabel={TABLE_HEAD} />

          <TableBody>
            {products.map((row: any) => (
              <CheckoutCartProduct
                key={row.id}
                row={row}
                onDelete={() => onDelete(row.id)}
                onDecrease={() => onDecreaseQuantity(row.id)}
                onIncrease={() => onIncreaseQuantity(row.id)}
              />
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );
}

CheckoutCartProductList.propTypes = {
  onDelete: PropTypes.func,
  products: PropTypes.array,
  onDecreaseQuantity: PropTypes.func,
  onIncreaseQuantity: PropTypes.func,
};
