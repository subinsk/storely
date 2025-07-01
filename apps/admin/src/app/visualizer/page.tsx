import { Container, Typography, Alert } from '@mui/material';

export default function Page() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Route Visualizer
      </Typography>
      <Alert severity="info">
        Route visualizer functionality will be available in a future update.
      </Alert>
    </Container>
  );
}
