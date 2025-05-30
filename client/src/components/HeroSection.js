import React from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  Fade,
  useTheme,
  Paper,
  Stack,
  Chip
} from '@mui/material';
import {
  Restaurant,
  Timer,
  FavoriteOutlined,
  AutoAwesome,
  LocalDining,
  MenuBook
} from '@mui/icons-material';

const HeroSection = ({ onGetStarted }) => {
  const theme = useTheme();

  const stats = [
    { number: '10K+', label: 'Recipes', icon: <MenuBook /> },
    { number: '5K+', label: 'Happy Cooks', icon: <FavoriteOutlined /> },
    { number: '50+', label: 'Cuisines', icon: <Restaurant /> },
  ];

  const features = [
    {
      icon: <AutoAwesome sx={{ fontSize: 28 }} />,
      title: 'AI-Powered',
      description: 'Smart recipe recommendations'
    },
    {
      icon: <Timer sx={{ fontSize: 28 }} />,
      title: 'Quick & Easy',
      description: 'Find recipes in seconds'
    },
    {
      icon: <LocalDining sx={{ fontSize: 28 }} />,
      title: 'Zero Waste',
      description: 'Use what you have'
    }
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, 
          ${theme.palette.primary.main}08 0%, 
          ${theme.palette.secondary.main}08 30%, 
          ${theme.palette.background.paper} 70%, 
          ${theme.palette.grey[50]} 100%)`,
        py: { xs: 8, md: 12 },
        borderRadius: 6,
        mb: { xs: 4, md: 6 },
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: { xs: 60, md: 100 },
          height: { xs: 60, md: 100 },
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-20px) rotate(180deg)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '5%',
          width: { xs: 40, md: 80 },
          height: { xs: 40, md: 80 },
          borderRadius: '30%',
          background: `linear-gradient(45deg, ${theme.palette.secondary.main}15, ${theme.palette.primary.main}15)`,
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          right: '20%',
          width: { xs: 30, md: 60 },
          height: { xs: 30, md: 60 },
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${theme.palette.warning.main}20, ${theme.palette.error.main}20)`,
          animation: 'float 10s ease-in-out infinite',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <Box>
                {/* Badge */}
                <Chip
                  label="✨ AI-Powered Recipe Discovery"
                  sx={{
                    mb: 3,
                    px: 2,
                    py: 0.5,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                    border: `1px solid ${theme.palette.primary.main}30`,
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                />

                {/* Main Heading */}
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.1,
                    mb: 3,
                    background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Turn Your Kitchen Into a{' '}
                  <Box
                    component="span"
                    sx={{
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -4,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        borderRadius: 2,
                      }
                    }}
                  >
                    Culinary Adventure
                  </Box>
                </Typography>

                {/* Subtitle */}
                <Typography
                  variant="h6"
                  color="textSecondary"
                  sx={{
                    mb: 4,
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    fontWeight: 400,
                    lineHeight: 1.6,
                    maxWidth: 500,
                  }}
                >
                  Discover amazing recipes using ingredients you already have. 
                  Let AI be your personal chef and meal planner.
                </Typography>

                {/* CTA Buttons */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={onGetStarted}
                    sx={{
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderRadius: 50,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      boxShadow: '0 8px 32px rgba(255, 107, 53, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(255, 107, 53, 0.4)',
                      },
                    }}
                  >
                    Start Cooking Now 🚀
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 50,
                      borderWidth: 2,
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        borderWidth: 2,
                        background: theme.palette.primary.main + '10',
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    Watch Demo 📺
                  </Button>
                </Stack>

                {/* Stats */}
                <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
                  {stats.map((stat, index) => (
                    <Box key={index} sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="h5"
                        fontWeight={800}
                        color="primary.main"
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        {stat.icon}
                        {stat.number}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" fontWeight={500}>
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Fade>
          </Grid>

          {/* Right Content - Visual Elements */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={1500}>
              <Box sx={{ position: 'relative' }}>
                {/* Main Visual Card */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 6,
                    background: `linear-gradient(135deg, white 0%, ${theme.palette.grey[50]} 100%)`,
                    border: `2px solid ${theme.palette.grey[100]}`,
                    position: 'relative',
                    overflow: 'hidden',
                    transform: 'rotate(-2deg)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'rotate(0deg) scale(1.02)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  {/* Recipe Card Mockup */}
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%, 100%': { transform: 'scale(1)' },
                          '50%': { transform: 'scale(1.05)' },
                        },
                      }}
                    >
                      <Restaurant sx={{ fontSize: 40, color: 'white' }} />
                    </Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      Perfect Recipe Found!
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Based on your ingredients
                    </Typography>
                  </Box>

                  {/* Mock ingredients */}
                  <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" sx={{ gap: 1 }}>
                    {['🍅 Tomatoes', '🧄 Garlic', '🧀 Cheese', '🍝 Pasta'].map((ingredient, index) => (
                      <Chip
                        key={index}
                        label={ingredient}
                        size="small"
                        sx={{
                          background: theme.palette.primary.main + '15',
                          fontWeight: 600,
                          animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                          '@keyframes fadeInUp': {
                            from: { opacity: 0, transform: 'translateY(20px)' },
                            to: { opacity: 1, transform: 'translateY(0)' },
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Paper>

                {/* Floating Feature Cards */}
                {features.map((feature, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      position: 'absolute',
                      p: 2,
                      borderRadius: 4,
                      background: 'white',
                      border: `1px solid ${theme.palette.grey[200]}`,
                      minWidth: 140,
                      animation: `float 4s ease-in-out infinite ${index * 0.5}s`,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                      ...(index === 0 && {
                        top: '10%',
                        right: '-10%',
                      }),
                      ...(index === 1 && {
                        bottom: '30%',
                        left: '-15%',
                      }),
                      ...(index === 2 && {
                        top: '50%',
                        right: '80%',
                      }),
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          color: theme.palette.primary.main,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {feature.title}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {feature.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
