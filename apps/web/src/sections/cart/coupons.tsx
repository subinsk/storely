import SvgColor from "@/components/svg-color";
import {
  Card,
  CardContent,
  CardMedia,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

export default function Coupons({ coupons }: { coupons: any }) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          {coupons.map((coupon: any, index: number) => (
            <>
              <Stack
                key={coupon.id}
                direction="row"
                alignItems="center"
                spacing={2}
              >
                <SvgColor
                  sx={{
                    color: "primary.main",
                    width: 32,
                    height: 32,
                  }}
                  src="/assets/icons/components/ic_coupon.svg"
                />
                <Stack spacing={0.1}>
                  <Typography variant="body1">{coupon.code}</Typography>
                  <Typography variant="body2" color="green">
                    {coupon.name} offer applied
                  </Typography>
                </Stack>
              </Stack>
              {index < coupons.length - 1 && <Divider />}
            </>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
