import { Container, Typography, Box, Card, CardContent, Grid } from '@mui/material';

export default function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        About Us
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" paragraph>
          Welcome to our store! We are dedicated to providing high-quality products
          and exceptional customer service. Our mission is to make online shopping
          a delightful experience for everyone.
        </Typography>
        <Typography variant="body1" paragraph>
          Founded with the vision of creating a modern, user-friendly e-commerce
          platform, we strive to connect customers with the products they love.
          From electronics to fashion, home goods to beauty products, we offer
          a wide range of items to suit every need and preference.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Our Mission
              </Typography>
              <Typography variant="body2">
                To provide exceptional products and services that enhance our
                customers' lives while building lasting relationships based on
                trust and satisfaction.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Our Vision
              </Typography>
              <Typography variant="body2">
                To be the leading e-commerce platform that customers trust
                for quality, convenience, and innovation in online shopping.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Our Values
              </Typography>
              <Typography variant="body2">
                Customer-first approach, quality assurance, innovation,
                sustainability, and community engagement are at the core
                of everything we do.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
