import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
  CardActions,
  IconButton,
  Tooltip,
  Fade,
  Skeleton,
  useTheme,
  Stack,
  Avatar,
} from '@mui/material';
import {
  AccessTime,
  Restaurant,
  FavoriteOutlined,
  Favorite,
  Visibility,
  LocalDining,
  Star,
  PlayArrow,
  BookmarkBorder,
  Bookmark
} from '@mui/icons-material';

const RecipeCard = ({ recipe, onViewDetails, loading = false }) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const theme = useTheme();

  if (loading) {
    return (
      <Card sx={{ 
        height: '100%',
        borderRadius: 4,
        overflow: 'hidden'
      }}>
        <Skeleton variant="rectangular" height={240} />
        <CardContent sx={{ p: 3 }}>
          <Skeleton variant="text" height={28} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Skeleton variant="rectangular" width={80} height={28} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" width={100} height={28} sx={{ borderRadius: 2 }} />
          </Box>
          <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 2 }} />
        </CardContent>
      </Card>
    );
  }

  const getMissedIngredientsColor = (count) => {
    if (count === 0) return 'success';
    if (count <= 2) return 'warning';
    return 'error';
  };

  const getDifficultyLevel = (missedIngredients) => {
    if (!missedIngredients) return 'Easy';
    if (missedIngredients.length === 0) return 'Ready to Cook!';
    if (missedIngredients.length <= 2) return 'Easy';
    if (missedIngredients.length <= 4) return 'Medium';
    return 'Complex';
  };

  const getDifficultyColor = (missedIngredients) => {
    if (!missedIngredients || missedIngredients.length === 0) return theme.palette.success.main;
    if (missedIngredients.length <= 2) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <Fade in timeout={300}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.grey[200]}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          background: 'white',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            borderColor: theme.palette.primary.main,
            '& .recipe-image': {
              transform: 'scale(1.05)',
            },
            '& .recipe-overlay': {
              opacity: 1,
            }
          }
        }}
      >
        {/* Image Section */}
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <CardMedia
            className="recipe-image"
            component="img"
            height="240"
            image={recipe.image || `https://via.placeholder.com/400x240/f5f5f5/999999?text=No+Image`}
            alt={recipe.title}
            sx={{
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Gradient Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
            }}
          />

          {/* Top Action Buttons */}
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              display: 'flex',
              gap: 1,
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setBookmarked(!bookmarked);
              }}
              sx={{
                bgcolor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  bgcolor: 'white',
                  transform: 'scale(1.1)',
                }
              }}
            >
              {bookmarked ? (
                <Bookmark sx={{ fontSize: 18, color: theme.palette.primary.main }} />
              ) : (
                <BookmarkBorder sx={{ fontSize: 18 }} />
              )}
            </IconButton>
            
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setLiked(!liked);
              }}
              sx={{
                bgcolor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  bgcolor: 'white',
                  transform: 'scale(1.1)',
                }
              }}
            >
              {liked ? (
                <Favorite sx={{ fontSize: 18, color: theme.palette.error.main }} />
              ) : (
                <FavoriteOutlined sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Box>

          {/* Difficulty Badge */}
          <Chip
            label={getDifficultyLevel(recipe.missedIngredients)}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              bgcolor: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              fontWeight: 600,
              fontSize: '0.75rem',
              color: getDifficultyColor(recipe.missedIngredients),
              border: `1px solid ${getDifficultyColor(recipe.missedIngredients)}30`,
            }}
          />

          {/* Quick Stats Overlay */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              right: 12,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Stack direction="row" spacing={1}>
              {recipe.readyInMinutes && (
                <Chip
                  icon={<AccessTime sx={{ fontSize: 14 }} />}
                  label={`${recipe.readyInMinutes}m`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '0.7rem',
                    height: 24,
                    '& .MuiChip-icon': {
                      fontSize: 14,
                    }
                  }}
                />
              )}
              {recipe.servings && (
                <Chip
                  icon={<Restaurant sx={{ fontSize: 14 }} />}
                  label={`${recipe.servings}`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '0.7rem',
                    height: 24,
                    '& .MuiChip-icon': {
                      fontSize: 14,
                    }
                  }}
                />
              )}
            </Stack>

            {/* Rating */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                px: 1,
                py: 0.5,
              }}
            >
              <Star sx={{ fontSize: 16, color: '#FFD700', mr: 0.5 }} />
              <Typography variant="caption" fontWeight={600}>
                {(Math.random() * 2 + 3).toFixed(1)}
              </Typography>
            </Box>
          </Box>

          {/* Hover Play Button */}
          <Box
            className="recipe-overlay"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            <IconButton
              onClick={() => onViewDetails(recipe.id)}
              sx={{
                bgcolor: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                width: 56,
                height: 56,
                '&:hover': {
                  bgcolor: 'white',
                  transform: 'scale(1.1)',
                }
              }}
            >
              <PlayArrow sx={{ fontSize: 28, color: theme.palette.primary.main }} />
            </IconButton>
          </Box>
        </Box>
        
        {/* Content Section */}
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {/* Title */}
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{
              fontWeight: 700,
              lineHeight: 1.3,
              height: '2.6em',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 2,
              fontSize: '1.1rem',
            }}
          >
            {recipe.title}
          </Typography>

          {/* Ingredients Summary */}
          {recipe.usedIngredients && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: theme.palette.success.main + '20',
                    mr: 1.5,
                  }}
                >
                  <LocalDining sx={{ fontSize: 16, color: theme.palette.success.main }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={600} color="success.main">
                    {recipe.usedIngredients.length} ingredients you have
                  </Typography>
                  {recipe.missedIngredients && recipe.missedIngredients.length > 0 && (
                    <Typography variant="caption" color="textSecondary">
                      Need {recipe.missedIngredients.length} more
                    </Typography>
                  )}
                </Box>
              </Box>
              
              {recipe.missedIngredients && recipe.missedIngredients.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {recipe.missedIngredients.slice(0, 3).map((ingredient, index) => (
                    <Chip
                      key={index}
                      label={ingredient.name}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        fontSize: '0.7rem', 
                        height: 24,
                        borderColor: theme.palette.grey[300],
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                        }
                      }}
                    />
                  ))}
                  {recipe.missedIngredients.length > 3 && (
                    <Tooltip
                      title={recipe.missedIngredients.slice(3).map(ing => ing.name).join(', ')}
                      arrow
                    >
                      <Chip
                        label={`+${recipe.missedIngredients.length - 3}`}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          fontSize: '0.7rem', 
                          height: 24, 
                          cursor: 'help',
                          borderColor: theme.palette.grey[300],
                        }}
                      />
                    </Tooltip>
                  )}
                </Box>
              )}
            </Box>
          )}
        </CardContent>

        {/* Action Section */}
        <CardActions sx={{ p: 3, pt: 0 }}>
          <Button
            size="large"
            onClick={() => onViewDetails(recipe.id)}
            fullWidth
            variant="contained"
            startIcon={<Visibility />}
            sx={{
              borderRadius: 3,
              py: 1.5,
              fontWeight: 700,
              fontSize: '0.95rem',
              textTransform: 'none',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(255, 107, 53, 0.4)',
              }
            }}
          >
            View Recipe
          </Button>
        </CardActions>
      </Card>
    </Fade>
  );
};

export default RecipeCard;
