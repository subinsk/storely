// @mui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
// hooks
import { useSession } from "next-auth/react";
// routes
import { paths } from "@/routes/paths";
// locales
import { useLocales } from "@/locales";
// components
import {Label} from "@storely/shared/components/label";

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const { data: session } = useSession();
  const user = session?.user;

  const { t } = useLocales();

  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: "center",
      }}
    >
      <Stack alignItems="center">
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={user?.image || undefined}
            alt={user?.name || undefined}
            sx={{ width: 48, height: 48 }}
          />
          <Label
            color="success"
            variant="filled"
            sx={{
              top: -6,
              px: 0.5,
              left: 40,
              height: 20,
              position: "absolute",
              borderBottomLeftRadius: 2,
            }}
          >
            Free
          </Label>
        </Box>

        <Stack spacing={0.5} sx={{ mt: 1.5, mb: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.name}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: "text.disabled" }}>
            {user?.email}
          </Typography>
        </Stack>

        <Button
          variant="contained"
          href={"/dashboard/pricing"}
          target="_blank"
          rel="noopener"
        >
          {t("upgrade_to_pro")}
        </Button>
      </Stack>
    </Stack>
  );
}
