import { Stack, Typography } from "@mui/material";

export default function TopPicks() {
  return (
    <Stack spacing={3} width="100%" py={22}>
      <Stack spacing={0.5} mx="auto">
        <Typography variant="h3">Top Picks For You</Typography>
        <Typography variant="body1">
          Impressive Collection For Your Dream Home
        </Typography>
      </Stack>
    </Stack>
  );
}
