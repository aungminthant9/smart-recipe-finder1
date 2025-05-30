import React, { useState, useEffect, useRef } from 'react';
import {
Container,
Typography,
Box,
Alert,
Grid,
Fade,
Grow,
Paper,
TextField,
Button,
InputAdornment,
CircularProgress,
Divider
} from '@mui/material';
import { AutoAwesome, Search } from '@mui/icons-material';
import axios from 'axios';
import HeroSection from './components/HeroSection';
import IngredientInput from './components/IngredientInput';
import RecipeCard from './components/RecipeCard';
import LoadingState, { RecipeGridLoading } from './components/LoadingState';
import EmptyState from './components/EmptyState';
import RecipeDetailModal from './components/RecipeDetailModal';
import MealPlanner from './components/MealPlanner';


function App() {
const [backendStatus, setBackendStatus] = useState('checking');
const [recipes, setRecipes] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [showHero, setShowHero] = useState(true);
const ingredientInputRef = useRef(null);


// State for AI Search
const [aiQuery, setAiQuery] = useState('');
const [aiLoading, setAiLoading] = useState(false);
const [aiError, setAiError] = useState('');


// State for Recipe Detail Modal
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedRecipeId, setSelectedRecipeId] = useState(null);


// Test backend connection and API keys
useEffect(() => {
const testBackend = async () => {
try {
const response = await axios.get('http://localhost:5000/api/status');
if (response.data.status === 'Online') {
setBackendStatus('connected');
if (!response.data.spoonacularConfigured) {
setError("Spoonacular API key is missing in the backend's .env file.");
} else {
setError('');
}


      if (!response.data.aiConfigured) {
         setAiError("AI service is not configured (Hugging Face API token missing in .env). AI features will be disabled.");
      } else {
         setAiError('');
      }
    }
  } catch (error) {
    setBackendStatus('error');
    setError('❌ Backend connection failed. Make sure the server is running.');
    setAiError('');
  }
};

testBackend();

}, []);


// Search recipes by ingredients
const searchRecipesByIngredients = async (ingredients) => {
setLoading(true);
setError('');
setAiError('');
setRecipes([]);


try {
  const response = await axios.post('http://localhost:5000/api/recipes/search-by-ingredients', {
    ingredients: ingredients
  });

  if (response.data.success) {
    setRecipes(response.data.recipes);
  } else {
     setError(response.data.error || 'Failed to search recipes by ingredients');
  }
} catch (err) {
  console.error("Ingredient Search Error:", err);
  setError(err.response?.data?.error || 'Failed to search recipes by ingredients');
} finally {
  setLoading(false);
}

};


// AI Search function
const searchRecipesWithAI = async () => {
if (!aiQuery.trim()) {
setAiError('Please enter a query for the AI.');
return;
}


setAiLoading(true);
setError('');
setAiError('');
setRecipes([]);

try {
  const response = await axios.post('http://localhost:5000/api/ai/analyze-query', {
    query: aiQuery
  });

  if (response.data.success) {
     setRecipes(response.data.recipes);
     if(response.data.recipes.length === 0) {
         setAiError(response.data.message || "Found 0 recipes matching your criteria. Try a different query?");
     }
  } else {
     setAiError(response.data.message || 'AI failed to understand your query or find recipes.');
  }

} catch (err) {
  console.error("AI Search Error:", err);
  setAiError(err.response?.data?.error || 'Failed to analyze query or find recipes.');
} finally {
  setAiLoading(false);
}

};


// Function to open the recipe detail modal
const viewRecipeDetails = (recipeId) => {
setSelectedRecipeId(recipeId);
setIsModalOpen(true);
};


// Function to close the recipe detail modal
const handleCloseModal = () => {
setIsModalOpen(false);
setSelectedRecipeId(null);
};


// Handle "Start Cooking Now" button click - Show all features
const handleGetStarted = () => {
setShowHero(false);
setTimeout(() => {
ingredientInputRef.current?.scrollIntoView({
behavior: 'smooth',
block: 'start'
});
}, 100);
};


const handleAiKeyPress = (e) => {
if (e.key === 'Enter') {
searchRecipesWithAI();
}
};


const getStatusAlert = () => {
switch (backendStatus) {
case 'checking':
return (
<Alert
severity="info"
sx={{
mb: { xs: 2, md: 3 },
borderRadius: 3,
'& .MuiAlert-icon': {
fontSize: 24,
}
}}
>
🔄 Connecting to backend...
</Alert>
);
case 'connected':
return null;
case 'error':
return (
<Alert
severity="error"
sx={{
mb: { xs: 2, md: 3 },
borderRadius: 3,
'& .MuiAlert-icon': {
fontSize: 24,
}
}}
>
❌ Backend connection failed. Make sure the server is running.
</Alert>
);
default:
return null;
}
};


// Determine if AI search and Meal Planner sections should be visible
const isAiEnabled = backendStatus === 'connected' && aiError !== "AI service is not configured (Hugging Face API token missing in .env). AI features will be disabled.";


return (
<Box sx={{
minHeight: '100vh',
bgcolor: 'background.default',
py: { xs: 2, md: 4 },
position: 'relative'
}}>
<Container maxWidth="lg">
{getStatusAlert()}


    {/* Only render main content if backend is connected */}
    {backendStatus === 'connected' && (
      <>
        {/* Hero Section - Only show initially */}
        {showHero && (
          <Fade in timeout={1000}>
            <Box sx={{ mb: { xs: 4, md: 6 } }}>
              <HeroSection onGetStarted={handleGetStarted} />
            </Box>
          </Fade>
        )}

        {/* All Features Section - Show after clicking "Start Cooking Now" */}
        {!showHero && (
          <>
            {/* Ingredient Input Section */}
            <Fade in timeout={500}>
              <Box ref={ingredientInputRef} sx={{ mb: { xs: 3, md: 4 } }}>
                 <IngredientInput onSearch={searchRecipesByIngredients} loading={loading} />
              </Box>
            </Fade>

            {/* AI Features Section - Show immediately when hero is hidden */}
            {isAiEnabled && (
              <>
                {/* Enhanced Divider between sections */}
                <Fade in timeout={700}>
                    <Box sx={{ textAlign: 'center', my: { xs: 4, md: 6 } }}>
                        <Divider>
                            <Paper
                              sx={{
                                px: 4,
                                py: 2,
                                background: `linear-gradient(45deg, #9C27B0, #673AB7)`,
                                color: 'white',
                                borderRadius: 25,
                                boxShadow: '0 4px 20px rgba(156, 39, 176, 0.3)',
                              }}
                            >
                              <Typography variant="h6" fontWeight={700} sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1 
                              }}>
                                <AutoAwesome /> AI FEATURES
                              </Typography>
                            </Paper>
                        </Divider>
                    </Box>
                </Fade>

                {/* Enhanced AI Search Section */}
                <Fade in timeout={900}>
                    <Paper
                        sx={{
                            p: { xs: 4, md: 5 },
                            mb: { xs: 3, md: 4 },
                            background: `linear-gradient(135deg, rgba(156, 39, 176, 0.08) 0%, rgba(103, 58, 183, 0.08) 100%)`,
                            border: `2px solid rgba(156, 39, 176, 0.2)`,
                            borderRadius: 6,
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                              borderColor: 'rgba(156, 39, 176, 0.4)',
                              boxShadow: '0 12px 40px rgba(156, 39, 176, 0.15)',
                            }
                        }}
                    >
                        {/* Enhanced background decoration */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -50,
                            right: -50,
                            width: 200,
                            height: 200,
                            borderRadius: '50%',
                            background: `radial-gradient(circle, rgba(156, 39, 176, 0.1) 0%, transparent 70%)`,
                            opacity: 0.6
                          }}
                        />

                         <Box sx={{ position: 'relative', zIndex: 1 }}>
                             <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 3, md: 4 } }}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 60,
                                    height: 60,
                                    borderRadius: '50%',
                                    background: `linear-gradient(45deg, #9C27B0, #673AB7)`,
                                    mr: 3,
                                    boxShadow: '0 8px 24px rgba(156, 39, 176, 0.3)',
                                  }}
                                >
                                  <AutoAwesome sx={{ fontSize: 28, color: 'white' }} />
                                </Box>
                                <Box>
                                  <Typography variant="h4" fontWeight={700} gutterBottom>
                                    Ask the AI Chef!
                                  </Typography>
                                  <Typography variant="body1" color="textSecondary">
                                    Describe what you're craving and let AI find the perfect recipes
                                  </Typography>
                                </Box>
                            </Box>

                            <TextField
                                fullWidth
                                label="Describe the recipes you want"
                                value={aiQuery}
                                onChange={(e) => setAiQuery(e.target.value)}
                                onKeyPress={handleAiKeyPress}
                                placeholder="e.g., healthy vegetarian dinner recipes, quick breakfast ideas..."
                                variant="outlined"
                                disabled={aiLoading}
                                 sx={{
                                    '& .MuiOutlinedInput-root': {
                                      background: 'white',
                                      borderRadius: 4,
                                      fontSize: '1.1rem',
                                      '& fieldset': {
                                        borderWidth: 2,
                                      },
                                      '&:hover fieldset': {
                                        borderColor: '#9C27B0',
                                      },
                                      '&.Mui-focused fieldset': {
                                        borderColor: '#9C27B0',
                                      },
                                    },
                                    '& .MuiInputLabel-root': {
                                      fontSize: '1.1rem',
                                      fontWeight: 500,
                                    },
                                    mb: { xs: 2, md: 3 }
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {aiLoading && <CircularProgress size={24} sx={{ color: '#9C27B0' }} />}
                                        </InputAdornment>
                                    ),
                                 }}
                            />

                             {/* Display AI processing errors */}
                             <Fade in={aiError !== '' && !aiError.includes('AI service is not configured')} timeout={300}>
                                <Box sx={{ mb: { xs: 2, md: 3 } }}>
                                    <Alert severity="error" sx={{ borderRadius: 3 }}>
                                        {aiError}
                                    </Alert>
                                </Box>
                             </Fade>

                            <Button
                                variant="contained"
                                size="large"
                                onClick={searchRecipesWithAI}
                                disabled={!aiQuery.trim() || aiLoading || !isAiEnabled}
                                 startIcon={aiLoading ? null : <Search />}
                                sx={{
                                    width: '100%',
                                    py: { xs: 2, md: 2.5 },
                                    fontSize: { xs: '1.1rem', md: '1.2rem' },
                                    fontWeight: 700,
                                    borderRadius: 4,
                                    background: `linear-gradient(45deg, #9C27B0, #673AB7)`,
                                    boxShadow: '0 8px 32px rgba(156, 39, 176, 0.3)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        background: `linear-gradient(45deg, #673AB7, #9C27B0)`,
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 12px 40px rgba(156, 39, 176, 0.4)',
                                    },
                                    '&:disabled': {
                                        background: 'grey.300',
                                                                                    color: 'grey.500',
                                        transform: 'none',
                                        boxShadow: 'none',
                                    }
                                 }}
                            >
                                {aiLoading ? (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <CircularProgress size={24} color="inherit" />
                                    AI Chef is thinking...
                                  </Box>
                                ) : (
                                  'Ask AI Chef'
                                )}
                            </Button>
                        </Box>
                    </Paper>
                 </Fade>

                {/* Enhanced Meal Planner Section */}
                 <Fade in timeout={1100}>
                     <Box>
                         <MealPlanner onRecipeClick={viewRecipeDetails} />
                     </Box>
                 </Fade>
              </>
            )}

            {/* API Key Warnings - Only show when not on hero page */}
             <Fade in={error !== '' && error.includes('Spoonacular')} timeout={300}>
                 <Box sx={{mb: { xs: 2, md: 3 }}}>
                    <Alert 
                      severity="warning"
                      sx={{ 
                        borderRadius: 3,
                        '& .MuiAlert-icon': {
                          fontSize: 24,
                        }
                      }}
                    >
                       ⚠️ {error}
                    </Alert>
                 </Box>
             </Fade>

             <Fade in={backendStatus === 'connected' && aiError.includes('AI service is not configured')} timeout={300}>
                 <Box sx={{mb: { xs: 2, md: 3 }}}>
                    <Alert 
                      severity="warning"
                      sx={{ 
                        borderRadius: 3,
                        '& .MuiAlert-icon': {
                          fontSize: 24,
                        }
                      }}
                    >
                       🤖 {aiError}
                    </Alert>
                 </Box>
             </Fade>

             <Fade in={error !== '' && !error.includes('Spoonacular')} timeout={300}>
                <Box sx={{ mb: { xs: 2, md: 3 } }}>
                    <Alert 
                      severity="error"
                      sx={{ 
                        borderRadius: 3,
                        '& .MuiAlert-icon': {
                          fontSize: 24,
                        }
                      }}
                    >
                        {error}
                    </Alert>
                </Box>
             </Fade>

            {/* Loading states */}
            {(loading || aiLoading) && (
                 <Fade in timeout={500}>
                    <Box sx={{ mb: { xs: 3, md: 4 } }}>
                       {loading && !aiLoading && <RecipeGridLoading />}
                       {aiLoading && !loading && <LoadingState message="The AI Chef is finding recipes based on your request..." />}
                       {(loading && aiLoading) && <LoadingState message="Searching..." />}
                    </Box>
                 </Fade>
            )}

            {/* Enhanced Recipe Results */}
            {recipes.length > 0 && !loading && !aiLoading && (
              <Fade in timeout={500}>
                <Box>
                   <Paper
                     sx={{
                       p: { xs: 3, md: 4 },
                       mb: { xs: 3, md: 4 },
                       textAlign: 'center',
                       background: `linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, rgba(255, 107, 53, 0.08) 100%)`,
                       border: `2px solid rgba(76, 175, 80, 0.2)`,
                       borderRadius: 4,
                     }}
                   >
                    <Typography 
                      variant="h4" 
                      component="h2" 
                      gutterBottom 
                      fontWeight={700}
                      sx={{
                        background: `linear-gradient(45deg, #4CAF50, #FF6B35)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {aiQuery ? '🤖 AI Chef Suggestions' : '🍽️ Found Recipes'}
                    </Typography>
                    <Typography variant="h6" color="textSecondary" fontWeight={500}>
                       {recipes.length} delicious option{recipes.length !== 1 ? 's' : ''} found!
                    </Typography>
                   </Paper>

                  <Grid container spacing={{ xs: 2, md: 3 }}>
                    {recipes.map((recipe, index) => (
                      <Grow
                        in
                        timeout={400 + index * 150}
                        key={recipe.id}
                      >
                        <Grid item xs={12} sm={6} lg={4}>
                          <RecipeCard
                            recipe={recipe}
                            onViewDetails={viewRecipeDetails}
                          />
                        </Grid>
                      </Grow>
                    ))}
                  </Grid>
                </Box>
              </Fade>
            )}

            {/* Empty State */}
            {recipes.length === 0 && !loading && !aiLoading && error === '' && aiError === '' && (
              <Fade in timeout={500}>
                <Box sx={{ mb: { xs: 3, md: 4 } }}>
                  <EmptyState onAddIngredients={() => {
                    ingredientInputRef.current?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }} />
                </Box>
              </Fade>
            )}
          </>
        )}
      </>
    )}

    {/* Recipe Detail Modal */}
    <RecipeDetailModal
      recipeId={selectedRecipeId}
      open={isModalOpen}
      onClose={handleCloseModal}
    />

  </Container>
</Box>

);
}


export default App;