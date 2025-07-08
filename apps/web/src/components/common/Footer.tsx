import { Box, Typography, Container } from '@mui/material';
import { useOrganization } from '../../contexts/OrganizationContext';

export function Footer() {
  const { organization } = useOrganization();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f5f5f5',
        py: 4,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} {organization?.name || 'Store'}. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
