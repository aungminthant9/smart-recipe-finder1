import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Skeleton,
  Fade,
  useTheme,
  keyframes
} from '@mui/material';
import { Restaurant, AutoAwesome } from '@mui/icons-material';

// Floating animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const LoadingState = ({ message = "Finding amazing recipes..." }) => {
  const theme = useTheme();

  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            mb: 4,
            animation: `${float} 3s ease-in-out infinite`,
          }}
        >
          <CircularProgress
            size={80}
            thickness={3}
            sx={{
              color: theme.palette.primary.main,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animation: `${pulse} 2s ease-in-out infinite`,
            }}
          >
            <Restaurant sx={{ fontSize: 32, color: theme.palette.primary.main }} />
          </Box>
        </Box>

        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 1,
          }}
        >
          {message}
        </Typography>

        <Typography
          variant="body1"
          color="textSecondary"
          sx={{
            maxWidth: 400,
            animation: `${pulse} 3s ease-in-out infinite`,
          }}
        >
          Our AI chef is carefully selecting the perfect recipes for you...
        </Typography>

        {/* Animated cooking emojis */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          {['👨‍🍳', '🍳', '🥘', '🍽️'].map((emoji, index) => (
            <Typography
              key={index}
              variant="h4"
              sx={{
                animation: `${float} 2s ease-in-out infinite`,
                animationDelay: `${index * 0.5}s`,
              }}
            >
              {emoji}
            </Typography>
          ))}
        </Box>
      </Box>
    </Fade>
  );
};

// Enhanced Recipe Grid Loading with better skeletons
export const RecipeGridLoading = () => {
  const theme = useTheme();

  return (
    <Box>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Skeleton
          variant="text"
          width={300}
          height={40}
          sx={{ mx: 'auto', mb: 2, borderRadius: 2 }}
        />
        <Skeleton
          variant="text"
          width={200}
          height={24}
          sx={{ mx: 'auto', borderRadius: 2 }}
        />
      </Box>

      <Grid container spacing={3}>
        {[...Array(6)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 4,
                overflow: 'hidden',
                animation: `${pulse} 2s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`,
              }}
            >
              <Skeleton
                variant="rectangular"
                height={220}
                sx={{ bgcolor: theme.palette.grey[100] }}
              />
              <CardContent sx={{ p: 3 }}>
                <Skeleton
                  variant="text"
                  height={32}
                  sx={{ mb: 2, borderRadius: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Skeleton
                    variant="rectangular"
                    width={80}
                    height={28}
                    sx={{ borderRadius: 2 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={100}
                    height={28}
                    sx={{ borderRadius: 2 }}
                  />
                </Box>
                <Skeleton
                  variant="text"
                  height={20}
                  sx={{ mb: 1, borderRadius: 1 }}
                />
                <Skeleton
                  variant="text"
                  height={20}
                  width="80%"
                  sx={{ mb: 2, borderRadius: 1 }}
                />
                <Skeleton
                  variant="rectangular"
                  height={48}
                  sx={{ borderRadius: 3 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LoadingState;