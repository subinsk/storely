import PropTypes from "prop-types";
// @mui
import Button from "@mui/material/Button";
// routes
import { RouterLink } from "@/routes/components";
// config
import { PATH_AFTER_LOGIN } from "@/config";

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
