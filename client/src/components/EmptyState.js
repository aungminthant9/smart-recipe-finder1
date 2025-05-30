import React from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Kitchen,
  AutoAwesome,
  RestaurantMenu,
  TrendingUp,
} from '@mui/icons-material';

const EmptyState = ({ onAddIngredients }) => {
  const theme = useTheme();

  const suggestions = [
    {
      icon: <Kitchen sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Add Your Ingredients',
      description: 'Tell us what you have in your kitchen',
      action: 'Start Adding',
    },
    {
      icon: <AutoAwesome sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      title: 'AI-Powered Search',
      description: 'Let our AI chef find perfect recipes',
      action: 'Try AI Search',
    },
    {
      icon: <RestaurantMenu sx={{ fontSize: 40, color: theme.palette.info.main }} />,
      title: 'Meal Planning',
      description: 'Plan your entire week of meals',
      action: 'Plan Meals',
    },
  ];

  return (
    <Box
      sx={{
        textAlign: 'center',
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 4 },
      }}
    >
      <Paper
        sx={{
          p: { xs: 4, md: 6 },
          borderRadius: 6,
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
          border: `2px dashed ${theme.palette.grey[300]}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.palette.primary.main}05 0%, transparent 70%)`,
            opacity: 0.5,
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Main illustration */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
              🍽️
            </Typography>
            <Typography
              variant="h4"
              fontWeight={700}
              gutterBottom
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Ready to Cook Something Amazing?
            </Typography>
            <Typography
              variant="h6"
              color="textSecondary"
              sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}
            >
              Start by adding ingredients you have, or let our AI chef suggest recipes for you
            </Typography>
          </Box>

          {/* Action suggestions */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {suggestions.map((suggestion, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',
                    border: `2px solid transparent`,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      borderColor: theme.palette.primary.main,
                      boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                    },
                  }}
                  onClick={onAddIngredients}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      {suggestion.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {suggestion.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      {suggestion.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="primary"
                      fontWeight={600}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                      }}
                    >
                      {suggestion.action} <TrendingUp fontSize="small" />
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Primary CTA */}
          <Button
            variant="contained"
            size="large"
            onClick={onAddIngredients}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 700,
              borderRadius: 50,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              boxShadow: '0 8px 32px rgba(255, 107, 53, 0.3)',
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(255, 107, 53, 0.4)',
              },
            }}
          >
            Let's Start Cooking! 👨‍🍳
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmptyState;