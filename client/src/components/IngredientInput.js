import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Chip,
  Box,
  Grid,
  IconButton,
  Tooltip,
  Fade,
  useTheme,
  InputAdornment,
  Autocomplete,
  Collapse,
  Divider
} from '@mui/material';
import {
  Add,
  Search,
  Clear,
  Kitchen,
  AutoAwesome,
  ExpandMore,
  ExpandLess,
  LocalDining
} from '@mui/icons-material';

const IngredientInput = ({ onSearch, loading }) => {
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const theme = useTheme();

  // Enhanced ingredient suggestions with more variety
  const ingredientSuggestions = [
    'chicken breast', 'ground beef', 'salmon', 'eggs', 'tofu', 'cheese', 'milk', 'butter',
    'rice', 'pasta', 'bread', 'potatoes', 'quinoa', 'noodles', 'flour', 'oats',
    'onions', 'garlic', 'tomatoes', 'carrots', 'broccoli', 'spinach', 'mushrooms', 
    'bell peppers', 'cucumber', 'lettuce', 'avocado', 'lemon', 'lime', 'ginger',
    'olive oil', 'salt', 'pepper', 'soy sauce', 'honey', 'vinegar', 'herbs', 'spices'
  ];

  const addIngredient = (ingredient = currentIngredient) => {
    const trimmedIngredient = ingredient.trim();
    if (trimmedIngredient && !ingredients.includes(trimmedIngredient)) {
      setIngredients([...ingredients, trimmedIngredient]);
      setCurrentIngredient('');
    }
  };

  const removeIngredient = (ingredientToRemove) => {
    setIngredients(ingredients.filter(ingredient => ingredient !== ingredientToRemove));
  };

  const clearAllIngredients = () => {
    setIngredients([]);
  };

  const handleSearch = () => {
    if (ingredients.length > 0) {
      onSearch(ingredients);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  // Enhanced categorized ingredients
  const ingredientCategories = {
    '🥩 Proteins': ['chicken breast', 'ground beef', 'salmon', 'eggs', 'tofu', 'cheese', 'greek yogurt'],
    '🍚 Carbs & Grains': ['rice', 'pasta', 'bread', 'potatoes', 'quinoa', 'oats', 'couscous'],
    '🥬 Vegetables': ['onions', 'garlic', 'tomatoes', 'carrots', 'broccoli', 'spinach', 'mushrooms', 'bell peppers'],
    '🍎 Fruits': ['apples', 'bananas', 'berries', 'lemon', 'lime', 'oranges', 'avocado'],
    '🧄 Pantry Staples': ['olive oil', 'salt', 'pepper', 'flour', 'butter', 'milk', 'soy sauce', 'honey']
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 5 },
        mb: 4,
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
        border: `2px solid ${theme.palette.grey[100]}`,
        borderRadius: 6,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          borderColor: theme.palette.primary.light,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }
      }}
    >
      {/* Enhanced background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.primary.main}10 0%, transparent 70%)`,
          opacity: 0.6
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -50,
          left: -50,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.secondary.main}10 0%, transparent 70%)`,
          opacity: 0.4
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              mr: 3,
              boxShadow: '0 8px 24px rgba(255, 107, 53, 0.3)',
            }}
          >
            <Kitchen sx={{ fontSize: 28, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              What's in your kitchen?
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Add ingredients you have and we'll find perfect recipes for you
            </Typography>
          </Box>
        </Box>
        
        {/* Enhanced Ingredient Input with Autocomplete */}
        <Box sx={{ mb: 4 }}>
          <Autocomplete
            freeSolo
            options={ingredientSuggestions}
            value={currentIngredient}
            onInputChange={(event, newValue) => {
              setCurrentIngredient(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Add an ingredient"
                placeholder="e.g., chicken, rice, tomatoes..."
                variant="outlined"
                onKeyPress={handleKeyPress}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'white',
                    borderRadius: 4,
                    fontSize: '1.1rem',
                    '& fieldset': {
                      borderWidth: 2,
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.light,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '1.1rem',
                    fontWeight: 500,
                  },
                }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant="contained"
                        onClick={() => addIngredient()}
                        disabled={!currentIngredient.trim()}
                        sx={{
                          minWidth: 'auto',
                          width: 48,
                          height: 48,
                          borderRadius: 3,
                          mr: -1,
                        }}
                      >
                        <Add />
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Box>

        {/* Quick Add Categories Toggle */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setShowCategories(!showCategories)}
            startIcon={<AutoAwesome />}
            endIcon={showCategories ? <ExpandLess /> : <ExpandMore />}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            Quick Add Popular Ingredients
          </Button>
        </Box>

        {/* Collapsible Categories */}
        <Collapse in={showCategories}>
          <Paper
            sx={{
              p: 3,
              mb: 3,
              bgcolor: theme.palette.grey[50],
              borderRadius: 4,
              border: `1px solid ${theme.palette.grey[200]}`,
            }}
          >
            {Object.entries(ingredientCategories).map(([category, items], categoryIndex) => (
              <Box key={category} sx={{ mb: categoryIndex < Object.keys(ingredientCategories).length - 1 ? 3 : 0 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: theme.palette.text.primary }}>
                  {category}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {items.map((ingredient) => (
                    <Chip
                      key={ingredient}
                      label={ingredient}
                      onClick={() => addIngredient(ingredient)}
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        fontWeight: 500,
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }
                      }}
                      variant={ingredients.includes(ingredient) ? 'filled' : 'outlined'}
                      color={ingredients.includes(ingredient) ? 'primary' : 'default'}
                    />
                  ))}
                </Box>
                {categoryIndex < Object.keys(ingredientCategories).length - 1 && (
                  <Divider sx={{ mt: 2 }} />
                )}
              </Box>
            ))}
          </Paper>
        </Collapse>

        {/* Enhanced Selected Ingredients */}
        {ingredients.length > 0 && (
          <Fade in>
            <Paper
              sx={{
                p: 4,
                mb: 4,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
                border: `2px solid ${theme.palette.primary.main}20`,
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Background pattern */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 100,
                  height: 100,
                  background: `radial-gradient(circle, ${theme.palette.primary.main}15 0%, transparent 70%)`,
                  borderRadius: '50%',
                  transform: 'translate(30%, -30%)',
                }}
              />

              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalDining sx={{ fontSize: 24, mr: 2, color: theme.palette.primary.main }} />
                    <Typography variant="h6" fontWeight={700}>
                      Your ingredients ({ingredients.length})
                    </Typography>
                  </Box>
                  <Tooltip title="Clear all ingredients">
                    <IconButton 
                      onClick={clearAllIngredients} 
                      size="small"
                      sx={{
                        bgcolor: theme.palette.error.main + '20',
                        color: theme.palette.error.main,
                        '&:hover': {
                          bgcolor: theme.palette.error.main + '30',
                          transform: 'scale(1.1)',
                        }
                      }}
                    >
                      <Clear />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                  {ingredients.map((ingredient, index) => (
                    <Chip
                      key={ingredient}
                      label={ingredient}
                      onDelete={() => removeIngredient(ingredient)}
                      color="primary"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        height: 36,
                        '& .MuiChip-deleteIcon': {
                          fontSize: 20,
                          '&:hover': {
                            color: theme.palette.error.main,
                          }
                        },
                        animation: `fadeInUp 0.3s ease-out ${index * 0.1}s both`,
                        '@keyframes fadeInUp': {
                          from: {
                            opacity: 0,
                            transform: 'translateY(20px)',
                          },
                          to: {
                            opacity: 1,
                            transform: 'translateY(0)',
                          },
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Paper>
          </Fade>
        )}

        {/* Enhanced Search Button */}
        <Button
          variant="contained"
          size="large"
          onClick={handleSearch}
          disabled={ingredients.length === 0 || loading}
          startIcon={loading ? null : <Search />}
          sx={{
            width: '100%',
            py: 2.5,
            fontSize: '1.2rem',
            fontWeight: 700,
            borderRadius: 4,
            background: ingredients.length > 0 
              ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
              : theme.palette.grey[300],
            boxShadow: ingredients.length > 0 ? '0 8px 32px rgba(255, 107, 53, 0.3)' : 'none',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: ingredients.length > 0 
                ? `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                : theme.palette.grey[300],
              transform: ingredients.length > 0 ? 'translateY(-3px)' : 'none',
              boxShadow: ingredients.length > 0 ? '0 12px 40px rgba(255, 107, 53, 0.4)' : 'none',
            },
            '&:disabled': {
              background: theme.palette.grey[300],
              color: theme.palette.grey[500],
            }
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  border: `3px solid ${theme.palette.common.white}`,
                  borderTop: '3px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  mr: 2,
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  }
                }}
              />
              Finding amazing recipes...
            </Box>
          ) : ingredients.length === 0 ? (
            'Add ingredients to start cooking! 🍳'
          ) : (
            `Find Recipes with ${ingredients.length} ingredient${ingredients.length !== 1 ? 's' : ''} 🚀`
          )}
        </Button>

        {/* Helpful tip */}
        {ingredients.length === 0 && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              textAlign: 'center',
              mt: 2,
              fontStyle: 'italic',
            }}
          >
            💡 Tip: Add at least 2-3 ingredients for better recipe suggestions
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default IngredientInput;