import PropTypes from "prop-types";
import { useEffect, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
// @mui
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { formHelperTextClasses } from "@mui/material/FormHelperText";
// routes
import { paths } from "@/routes/paths";
// utils
import { fShortenNumber, fCurrency } from "@/utils/format-number";
// components
import Label from "@/components/label";
import Iconify from "@/components/iconify";
import { ColorPicker } from "@/components/color-utils";
import FormProvider, { RHFSelect } from "@/components/hook-form";
//
import IncrementerButton from "./common/incrementer-button";
import { useRouter } from "next/navigation";

// ----------------------------------------------------------------------

export default function ProductDetailsSummary({
  items,
  product,
  onAddCart,
  onGotoStep,
  disabledActions,
  ...other
}: {
  items: any;
  product: any;
  onAddCart: any;
  onGotoStep: any;
  disabledActions?: any;
  [x: string]: any;
}) {
  const router = useRouter();

  const {
    id,
    name,
    price,
    images,
    newLabel,
    mrp,
    quantity,
    saleLabel,
    totalRatings,
    totalReviews,
    inventoryType,
    subDescription,
  } = product;

  const available = quantity;
  const image = images[0];

  const existProduct =
    !!items?.length && items.map((item: any) => item.id).includes(id);

  const isMaxQuantity =
    !!items?.length &&
    items
      .filter((item: any) => item.id === id)
      .map((item: any) => item.quantity)[0] >= available;

  const defaultValues = {
    id,
    name,
    image,
    available,
    price,
    quantity: 1,
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch, control, setValue, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    if (product) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!existProduct) {
        onAddCart?.({
          ...data,
          subTotal: data.price * data.quantity,
        });
      }
      onGotoStep?.(0);
      router.push(paths.product.checkout);
    } catch (error) {
      console.error(error);
    }
  });

  const handleAddCart = useCallback(() => {
    try {
      onAddCart?.({
        ...values,
        subTotal: values.price * values.quantity,
      });
    } catch (error) {
      console.error(error);
    }
  }, [onAddCart, values]);

  const renderPrice = (
    <Box sx={{ typography: "h5" }}>
      {price && (
        <Box
          component="span"
          sx={{
            color: "text.disabled",
            textDecoration: "line-through",
            mr: 0.5,
          }}
        >
          {fCurrency(price)}
        </Box>
      )}

      {fCurrency(price)}
    </Box>
  );

  const renderShare = (
    <Stack direction="row" spacing={3} justifyContent="center">
      <Link
        variant="subtitle2"
        sx={{
          color: "text.secondary",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <Iconify icon="mingcute:add-line" width={16} sx={{ mr: 1 }} />
        Compare
      </Link>

      <Link
        variant="subtitle2"
        sx={{
          color: "text.secondary",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <Iconify icon="solar:heart-bold" width={16} sx={{ mr: 1 }} />
        Favorite
      </Link>

      <Link
        variant="subtitle2"
        sx={{
          color: "text.secondary",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <Iconify icon="solar:share-bold" width={16} sx={{ mr: 1 }} />
        Share
      </Link>
    </Stack>
  );

  const renderQuantity = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Quantity
      </Typography>

      <Stack spacing={1}>
        <IncrementerButton
          name="quantity"
          quantity={values.quantity}
          disabledDecrease={values.quantity <= 1}
          disabledIncrease={values.quantity >= available}
          onIncrease={() => setValue("quantity", values.quantity + 1)}
          onDecrease={() => setValue("quantity", values.quantity - 1)}
        />

        <Typography
          variant="caption"
          component="div"
          sx={{ textAlign: "right" }}
        >
          Available: {available}
        </Typography>
      </Stack>
    </Stack>
  );

  const renderActions = (
    <Stack direction="row" spacing={2}>
      <Button
        fullWidth
        disabled={isMaxQuantity || disabledActions}
        size="large"
        color="warning"
        variant="contained"
        startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
        onClick={handleAddCart}
        sx={{ whiteSpace: "nowrap" }}
      >
        Add to Cart
      </Button>

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        disabled={disabledActions}
      >
        Buy Now
      </Button>
    </Stack>
  );

  const renderSubDescription = (
    <Typography variant="body2" sx={{ color: "text.secondary" }}>
      {subDescription}
    </Typography>
  );

  const renderRating = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        color: "text.disabled",
        typography: "body2",
      }}
    >
      <Rating
        size="small"
        value={totalRatings}
        precision={0.1}
        readOnly
        sx={{ mr: 1 }}
      />
      {`(${fShortenNumber(totalReviews)} reviews)`}
    </Stack>
  );

  const renderLabels = (newLabel.enabled || saleLabel.enabled) && (
    <Stack direction="row" alignItems="center" spacing={1}>
      {newLabel.enabled && <Label color="info">{newLabel.content}</Label>}
      {saleLabel.enabled && <Label color="error">{saleLabel.content}</Label>}
    </Stack>
  );

  const renderInventoryType = (
    <Box
      component="span"
      sx={{
        typography: "overline",
        color:
          (inventoryType === "out of stock" && "error.main") ||
          (inventoryType === "low stock" && "warning.main") ||
          "success.main",
      }}
    >
      {inventoryType}
    </Box>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 3 }} {...other}>
        <Stack spacing={2} alignItems="flex-start">
          {renderLabels}

          {renderInventoryType}

          <Typography variant="h5">{name}</Typography>

          {renderRating}

          {renderPrice}

          {renderSubDescription}
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        {renderQuantity}

        <Divider sx={{ borderStyle: "dashed" }} />

        {renderActions}

        {renderShare}
      </Stack>
    </FormProvider>
  );
}

ProductDetailsSummary.propTypes = {
  items: PropTypes.array,
  disabledActions: PropTypes.bool,
  onAddCart: PropTypes.func,
  onGotoStep: PropTypes.func,
  product: PropTypes.object,
};
