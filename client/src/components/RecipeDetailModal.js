import React from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  CardMedia,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  useTheme
} from '@mui/material';
import {
  Close,
  ExpandMore,
  AccessTime,
  Restaurant,
  LocalDining,
  ListAlt,
  CheckCircleOutline,
  ArrowRightAlt,
  HealthAndSafety // Added the correct icon import
} from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%', // Responsive width
  maxWidth: 800, // Max width for larger screens
  maxHeight: '90vh', // Limit height and make scrollable
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: { xs: 2, md: 4 }, // Responsive padding
  overflowY: 'auto', // Enable vertical scrolling
  outline: 'none', // Remove default outline
};

const RecipeDetailModal = ({ recipeId, open, onClose }) => {
  const [recipe, setRecipe] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const theme = useTheme();

  // --- Move stepRegex definition here, outside formatInstructions ---
  // Regex to handle various numbering/bullet styles for instructions
  const stepRegex = /(\d+\.\s*|\*\s*|•\s*|\-\s*)/;
  // --- End of move ---


  React.useEffect(() => {
    if (!open || !recipeId) {
      // Reset state when closed
      setRecipe(null);
      setError('');
      return;
    }

    const fetchRecipeDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`http://localhost:5000/api/recipes/details/${recipeId}`);
        if (!response.ok) {
            // Attempt to read error message from response body
            const errorData = await response.json().catch(() => ({ message: 'Failed to fetch recipe details.' }));
            throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setRecipe(data.recipe);
        } else {
          // Handle API specific success: false response if any
          setError(data.error || 'Failed to fetch recipe details.');
        }
      } catch (err) {
        console.error("Failed to fetch recipe details:", err);
        setError(`Error loading recipe: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();

  }, [open, recipeId]); // Effect runs when modal opens or recipeId changes

  // Helper function to format instructions - now stepRegex is in the outer scope
  const formatInstructions = (instructionsHtml) => {
    if (!instructionsHtml) return null;
    // Basic HTML to text conversion and splitting by steps if numbered
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = instructionsHtml;
    const text = tempDiv.textContent || tempDiv.innerText || '';

    const lines = text.split('\n').filter(line => line.trim().length > 0);

    if (lines.length > 0) {
         // Try to group lines that start with a number/bullet
         const steps = [];
         let currentStep = '';

         for (const line of lines) {
             const trimmedLine = line.trim();
             if (stepRegex.test(trimmedLine)) { // stepRegex is accessible here
                 if (currentStep) {
                     steps.push(currentStep.trim());
                 }
                 currentStep = trimmedLine;
             } else {
                 currentStep += (currentStep ? ' ' : '') + trimmedLine;
             }
         }
         if (currentStep) {
              steps.push(currentStep.trim());
         }

         if (steps.length > 1) {
             return steps; // Return stepped list if detection seems successful
         }
    }


    // Fallback to splitting by sentences if step splitting fails or is inappropriate
     const sentenceSteps = text.split(/[.\n!?:]+/).filter(step => step.trim().length > 5); // Split by common sentence/paragraph endings

     if (sentenceSteps.length > 1) {
         return sentenceSteps;
     }


    // Final fallback: just return the whole text as one step if nothing else works
     return text.trim().length > 0 ? [text.trim()] : null;


  };

  // Helper function to format nutrition (basic)
  const formatNutrition = (nutrition) => {
      if (!nutrition?.nutrients) return null;
      // Filter and format key nutrients
      const keyNutrients = ['Calories', 'Protein', 'Fat', 'Carbohydrates', 'Sugar'];
      return nutrition.nutrients
          .filter(nutrient => keyNutrients.includes(nutrient.name))
          .map(nutrient => `${nutrient.name}: ${nutrient.amount.toFixed(1)}${nutrient.unit}`);
  }


  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="recipe-detail-modal-title"
      aria-describedby="recipe-detail-modal-description"
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            zIndex: 1 // Ensure it's above image
          }}
        >
          <Close />
        </IconButton>

        {loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography>Loading recipe details...</Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {recipe && !loading && !error && (
          <>
            {/* Recipe Image */}
            {recipe.image && (
              <CardMedia
                component="img"
                image={recipe.image}
                alt={recipe.title}
                sx={{
                  borderRadius: 2,
                  maxHeight: 300,
                  objectFit: 'cover',
                  mb: 3,
                  width: '100%', // Make image responsive
                  display: 'block', // Fix potential extra space below img
                }}
              />
            )}

            {/* Title and Summary */}
            <Typography id="recipe-detail-modal-title" variant="h4" component="h2" gutterBottom fontWeight={600}>
              {recipe.title}
            </Typography>

            {recipe.summary && (
               <Typography
                variant="body1"
                color="textSecondary"
                sx={{ mb: 3 }}
                // Using dangerouslySetInnerHTML as Spoonacular summary is HTML
                dangerouslySetInnerHTML={{ __html: recipe.summary }}
              />
            )}


            {/* Quick Info Chips */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {recipe.readyInMinutes && (
                <Chip icon={<AccessTime />} label={`${recipe.readyInMinutes} min`} />
              )}
               {recipe.servings && (
                <Chip icon={<Restaurant />} label={`${recipe.servings} servings`} />
              )}
              {/* Add other info like health score, diets etc. */}
              {recipe.healthScore > 0 && (
                 // Removed the extra curly braces here
                 <Chip icon={<HealthAndSafety />} label={`Health Score: ${recipe.healthScore}`} />
              )}
               {recipe.diets && recipe.diets.map(diet => (
                   <Chip key={diet} label={diet} variant="outlined" />
               ))}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Ingredients */}
            {recipe.extendedIngredients && recipe.extendedIngredients.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  <LocalDining sx={{ mr: 1, verticalAlign: 'bottom' }} /> Ingredients
                </Typography>
                <List dense>
                  {recipe.extendedIngredients.map((ingredient) => (
                    <ListItem key={ingredient.id || ingredient.name} disablePadding> {/* Use name as fallback key */}
                      <ListItemText primary={`${ingredient.amount ? ingredient.amount.toFixed(2).replace(/\.?0+$/, '') : ''} ${ingredient.unit} ${ingredient.name}${ingredient.original ? ` (${ingredient.original})` : ''}`.trim()} /> {/* Format amount, trim */}
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

             <Divider sx={{ my: 3 }} />

            {/* Instructions */}
            {recipe.instructions && (
              <Box sx={{ mb: 3 }}>
                 <Typography variant="h5" gutterBottom fontWeight={600}>
                   <ListAlt sx={{ mr: 1, verticalAlign: 'bottom' }} /> Instructions
                 </Typography>
                 {/* Use the helper function to format instructions */}
                 {(() => {
                     const steps = formatInstructions(recipe.instructions);
                     if (!steps || steps.length === 0) {
                         // Fallback to raw HTML rendering if formatting fails
                         return <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />;
                     }
                     // Render as a numbered list if steps were extracted
                     return (
                         <List>
                             {steps.map((step, index) => (
                                 <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                                     <ListItemText primary={<>
                                        {/* Attempt to not show number if the step already starts with one */}
                                        {/* stepRegex is accessible here */}
                                        {!stepRegex.test(step.trimStart()) && (
                                            <Typography component="span" fontWeight="bold" mr={1}>{index + 1}.</Typography>
                                        )}
                                        {step.trim()}
                                     </>}/>
                                 </ListItem>
                             ))}
                         </List>
                     );
                 })()}
               </Box>
             )}

            {/* Nutrition Info - Use Accordion to save space */}
            {recipe.nutrition && recipe.nutrition.nutrients && (
                <Accordion elevation={1} sx={{ mb: 3 }}>
                    {/* Use HealthAndSafety icon here */}
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="h6" fontWeight={600}>
                           <HealthAndSafety sx={{ mr: 1, verticalAlign: 'bottom' }} /> Basic Nutrition
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List dense>
                            {formatNutrition(recipe.nutrition).map((nutrient, index) => (
                                <ListItem key={index} disablePadding>
                                    <ListItemText primary={nutrient} />
                                </ListItem>
                            ))}
                        </List>
                         {/* Link to full nutrition info if available */}
                         {recipe.spoonacularSourceUrl && (
                              <Box sx={{mt: 2}}>
                                 <Link href={recipe.spoonacularSourceUrl} target="_blank" rel="noopener" underline="hover">
                                     <Typography variant="body2" sx={{display:'flex', alignItems: 'center'}}>
                                        Full Nutrition on Spoonacular <ArrowRightAlt sx={{ml:0.5}} fontSize="small"/>
                                     </Typography>
                                 </Link>
                             </Box>
                         )}
                    </AccordionDetails>
                </Accordion>
            )}

          </>
        )}
      </Box>
    </Modal>
  );
};

export default RecipeDetailModal;