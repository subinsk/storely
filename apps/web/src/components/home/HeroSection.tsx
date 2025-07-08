import { Box, Typography, Button, Container, Grid, Stack, IconButton } from '@mui/material';
import { ArrowForward, PlayArrow, ShoppingBag, TrendingUp, Security, LocalShipping } from '@mui/icons-material';
import { useOrganization } from '../../contexts/OrganizationContext';

interface HeroSectionProps {
  organization?: any;
}

export function HeroSection({ organization }: HeroSectionProps) {
  const { organization: org } = useOrganization();
  const currentOrg = organization || org;

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, 
            rgba(99, 102, 241, 0.1) 0%, 
            rgba(168, 85, 247, 0.1) 50%, 
            rgba(236, 72, 153, 0.1) 100%
          ),
          radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 70%),
          radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 70%),
          radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.1) 0%, transparent 70%)
        `,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
          animation: 'float 20s ease-in-out infinite',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                animation: 'fadeInUp 0.8s ease-out',
              }}
            >
              <Stack spacing={4}>
                <Box>
                  <Typography
                    variant="h1"
                    component="h1"
                    sx={{
                      fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      lineHeight: 1.1,
                      mb: 2,
                    }}
                  >
                    Welcome to{' '}
                    <Box component="span" sx={{ display: 'block' }}>
                      {currentOrg?.name || 'Our Store'}
                    </Box>
                  </Typography>
                  <Typography
                    variant="h5"
                    component="p"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 400,
                      lineHeight: 1.6,
                      mb: 3,
                    }}
                  >
                    Discover premium products crafted with passion. Experience the future of online shopping with our cutting-edge platform.
                  </Typography>
                </Box>

                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                      },
                    }}
                  >
                    Shop Now
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<PlayArrow />}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      borderColor: 'rgba(102, 126, 234, 0.3)',
                      color: 'text.primary',
                      '&:hover': {
                        borderColor: 'rgba(102, 126, 234, 0.6)',
                        backgroundColor: 'rgba(102, 126, 234, 0.05)',
                      },
                    }}
                  >
                    Watch Demo
                  </Button>
                </Stack>

                <Stack direction="row" spacing={4} sx={{ mt: 4 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      10K+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Happy Customers
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      5K+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Products
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      99%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Satisfaction
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                animation: 'fadeInUp 0.8s ease-out 0.2s both',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
                  component="img"
                  src="/assets/hero-image.jpg"
                  alt="Hero"
                  sx={{
                    width: '100%',
                    maxWidth: 500,
                    height: 'auto',
                    borderRadius: 4,
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
                    transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
                  }}
                />
                
                {/* Floating cards */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '-10%',
                    backgroundColor: 'white',
                    p: 2,
                    borderRadius: 2,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    animation: 'float 6s ease-in-out infinite',
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ShoppingBag color="primary" />
                    <Typography variant="body2" fontWeight="bold">
                      Fast Delivery
                    </Typography>
                  </Stack>
                </Box>

                <Box
                  sx={{
                    position: 'absolute',
                    top: '60%',
                    right: '-10%',
                    backgroundColor: 'white',
                    p: 2,
                    borderRadius: 2,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    animation: 'float 6s ease-in-out infinite 2s',
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Security color="primary" />
                    <Typography variant="body2" fontWeight="bold">
                      Secure Payment
                    </Typography>
                  </Stack>
                </Box>

                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '10%',
                    backgroundColor: 'white',
                    p: 2,
                    borderRadius: 2,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    animation: 'float 6s ease-in-out infinite 4s',
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TrendingUp color="primary" />
                    <Typography variant="body2" fontWeight="bold">
                      Best Prices
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Scroll indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'bounce 2s infinite',
        }}
      >
        <IconButton
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <ArrowForward sx={{ transform: 'rotate(90deg)', color: 'white' }} />
        </IconButton>
      </Box>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
          40% { transform: translateY(-10px) translateX(-50%); }
          60% { transform: translateY(-5px) translateX(-50%); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
}
