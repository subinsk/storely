import PropTypes from "prop-types";
// @mui
import Button from "@mui/material/Button";
// routes
// config
import { PATH_AFTER_LOGIN } from "@storely/shared/config";
import { RouterLink } from "@/routes/components";

// ----------------------------------------------------------------------

export default function LoginButton({ sx }: { sx?: any }) {
  return (
    <Button
      component={RouterLink}
      href={PATH_AFTER_LOGIN}
      variant="outlined"
      sx={{ mr: 1, ...sx }}
    >
      Login
    </Button>
  );
}

LoginButton.propTypes = {
  sx: PropTypes.object,
};
