import { m } from "framer-motion";
// @mui
import Box from "@mui/material/Box";
// hooks
import { useResponsive } from "@/hooks/use-responsive";
//
import { varContainer } from "./variants";

// ----------------------------------------------------------------------

export default function MotionViewport(
  { children }: { children: React.ReactNode },
  disableAnimatedMobile = true,
  ...other: any
) {
  const smDown = useResponsive("down", "sm");

  if (smDown && disableAnimatedMobile) {
    return <Box {...other}>{children}</Box>;
  }

  return (
    <Box
      component={m.div}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={varContainer()}
      {...other}
    >
      {children}
    </Box>
  );
}
