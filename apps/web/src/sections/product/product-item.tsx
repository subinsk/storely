import PropTypes from "prop-types";
// @mui
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
// routes
import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";
// utils
import { fCurrency } from "@storely/shared/utils/format-number";
// components
import Label from "@storely/shared/components/label";
import Image from "@storely/shared/components/image";
import {Iconify} from"@storely/shared/components/iconify";
import { ColorPreview } from "@storely/shared/components/color-utils";
//
import { useCheckoutContext } from "../checkout/context";

// ----------------------------------------------------------------------

export default function ProductItem({
  product,
}: {
  product: {
    id: string;
    name: string;
    slug: string;
    images: string[];
    price: number;
    mrp: number
    quantity: number
    colors: any[];
    available: boolean;
    sizes: any[];
    newLabel: { enabled: boolean; content: string };
    saleLabel: { enabled: boolean; content: string };
  };
}) {
  const { onAddToCart }: any = useCheckoutContext();

  const { id, slug, name, images, price, mrp, colors, sizes, newLabel, saleLabel, quantity } =
    product;

  const available = quantity > 0;

  const linkTo = paths.product.details(slug);

  const handleAddCart = async () => {
    const newProduct = {
      id,
      name,
      image: images[0],
      available,
      mrp,
      price,
      quantity: 1,
    };
    try {
      onAddToCart(newProduct);
    } catch (error) {
      console.error(error);
    }
  };

  const renderLabels = (newLabel.enabled || saleLabel.enabled) && (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ position: "absolute", zIndex: 9, top: 16, right: 16 }}
    >
      {newLabel.enabled && (
        <Label variant="filled" color="info">
          {newLabel.content}
        </Label>
      )}
      {saleLabel.enabled && (
        <Label variant="filled" color="error">
          {saleLabel.content}
        </Label>
      )}
    </Stack>
  );

  const renderImg = (
    <Box sx={{ position: "relative", p: 1 }}>
      {!!available && (
        <Fab
          color="warning"
          size="medium"
          className="add-cart-btn"
          onClick={handleAddCart}
          sx={{
            right: 16,
            bottom: 16,
            zIndex: 9,
            opacity: 0,
            position: "absolute",
            transition: (theme) =>
              theme.transitions.create("all", {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.shorter,
              }),
          }}
        >
          <Iconify icon="solar:cart-plus-bold" width={24} />
        </Fab>
      )}

      <Tooltip title={!available && "Out of stock"} placement="bottom-end">
        <Image
          alt={name}
          src={images[0]}
          ratio="1/1"
          sx={{
            borderRadius: 1.5,
            ...(!available && {
              opacity: 0.48,
              filter: "grayscale(1)",
            }),
          }}
        />
      </Tooltip>
    </Box>
  );

  const renderContent = (
    <Stack spacing={2.5} sx={{ p: 3, pt: 2 }}>
      <Link
        component={RouterLink}
        href={linkTo}
        color="inherit"
        variant="subtitle2"
        noWrap
      >
        {name}
      </Link>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {/* <ColorPreview colors={colors} /> */}

        <Stack direction="row" spacing={0.5} sx={{ typography: "subtitle1" }}>
          {mrp && (
            <Box
              component="span"
              sx={{ color: "text.disabled", textDecoration: "line-through" }}
            >
              {fCurrency(mrp)}
            </Box>
          )}

          <Box component="span">{fCurrency(price)}</Box>
        </Stack>
      </Stack>
    </Stack>
  );

  return (
    <Card
      sx={{
        "&:hover .add-cart-btn": {
          opacity: 1,
        },
      }}
    >
      {renderLabels}

      {renderImg}

      {renderContent}
    </Card>
  );
}

ProductItem.propTypes = {
  product: PropTypes.object,
};
