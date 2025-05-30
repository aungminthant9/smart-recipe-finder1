import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  Grid,
  Card,
  CardContent,
  Link as MuiLink, // Use MuiLink to avoid conflict with react-router-dom Link if added later
  useTheme
} from '@mui/material';
import {
  CalendarToday,
  Search,
  ExpandMore,
  // Ensure other necessary icons are imported if used in this component
  // e.g., Fastfood, FitnessCenter, Public, ListAlt, ShoppingBasketOutlined, ChevronRight
  Fastfood, FitnessCenter, Public, ListAlt, ShoppingBasketOutlined, ChevronRight // Added imports based on previous versions
} from '@mui/icons-material';
import axios from 'axios';

// Access the dynamic backend URL environment variable
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


// Define options for select inputs
const daysOptions = [
  { value: 3, label: '3 Days' },
  { value: 7, label: '7 Days' },
  { value: 10, label: '10 Days' },
  { value: 14, label: '14 Days' },
];

const mealsOptions = [
  { value: 'Breakfast', label: 'Breakfast' },
  { value: 'Lunch', label: 'Lunch' },
  { value: 'Dinner', label: 'Dinner' },
  { value: 'Snack', label: 'Snack' },
];

// Example diets - expand this list as needed
const dietOptions = [
  'Vegetarian', 'Vegan', 'Gluten Free', 'Ketogenic', 'Paleo', 'Low Carb',
  'Mediterranean', 'Pescatarian', 'Dairy Free', 'Nut Free'
];

// Example cuisines - expand this list as needed
const cuisineOptions = [
  'Italian', 'Mexican', 'Asian', 'Indian', 'Mediterranean', 'American',
  'French', 'Thai', 'Chinese', 'Japanese', 'Spanish', 'Middle Eastern'
];


const MealPlanner = ({ onRecipeClick }) => { // Receive a function to open recipe details
  const theme = useTheme();
  const [days, setDays] = useState(daysOptions[0].value);
  const [selectedMeals, setSelectedMeals] = useState(mealsOptions.map(m => m.value)); // Default to all
  const [selectedDiets, setSelectedDiets] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  // Add state for other potential inputs like 'exclude ingredients' later

  const [mealPlan, setMealPlan] = useState(null); // Store the generated meal plan
  const [groceryList, setGroceryList] = useState(null); // Store the generated grocery list
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMealChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedMeals(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

   const handleDietChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedDiets(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

   const handleCuisineChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCuisines(
      typeof value === 'string' ? value.split(',') : value,
    );
  };


  const generateMealPlan = async () => {
    // Add a check for the backend URL here too
    if (!BACKEND_URL) {
        setError("Frontend configuration error: Backend URL is not set. Meal planning is unavailable.");
        return; // Stop execution if URL is missing
    }

    setLoading(true);
    setError('');
    setMealPlan(null); // Clear previous plan
    setGroceryList(null); // Clear previous list

    // Basic validation
    if (selectedMeals.length === 0) {
        setError("Please select at least one meal type per day.");
        setLoading(false);
        return;
    }

    try {
      // Use the dynamic BACKEND_URL here
      const response = await axios.post(`${BACKEND_URL}/api/meal-plan/generate`, {
        days: days,
        mealsPerDay: selectedMeals,
        diet: selectedDiets,
        cuisine: selectedCuisines,
        // Add other preferences
      });

      if (response.data.success) {
        setMealPlan(response.data.mealPlan);
        setGroceryList(response.data.groceryList);
      } else {
        // Handle API specific success: false or error response
        setError(response.data.message || response.data.error || 'Failed to generate meal plan.');
      }
    } catch (err) {
      console.error("Meal Plan API Error:", err.response?.data || err.message);
      // Use the user-friendly error message from the backend if available
      setError(err.response?.data?.error || `An error occurred while generating the meal plan. Status: ${err.response?.status || 'N/A'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      sx={{
        p: { xs: 3, md: 4 },
        mb: { xs: 3, md: 4 },
        background: `linear-gradient(135deg, ${theme.palette.info.main}10 0%, ${theme.palette.primary.main}10 100%)`, // Light gradient
        border: `1px solid ${theme.palette.info.main}30`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Added icons for better visual */}
       <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 3 } }}>
        <CalendarToday sx={{ fontSize: { xs: 24, md: 32 }, mr: { xs: 1, md: 2 }, color: theme.palette.info.main }} />
        <Typography variant="h4" fontWeight={600}>
          Plan Your Meals
        </Typography>
      </Box>

      {/* Input Controls */}
      {/* Added icons to labels for better visual */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel id="days-label"><CalendarToday sx={{fontSize: 18, verticalAlign: 'middle', mr: 0.5}}/> Plan for</InputLabel>
            <Select
              labelId="days-label"
              id="days-select"
              value={days}
              label="Plan for"
              onChange={(e) => setDays(e.target.value)}
            >
              {daysOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel id="meals-label"><RestaurantMenu sx={{fontSize: 18, verticalAlign: 'middle', mr: 0.5}}/> Meals per Day</InputLabel>
            <Select
              labelId="meals-label"
              id="meals-select"
              multiple
              value={selectedMeals}
              onChange={handleMealChange}
              input={<OutlinedInput label="Meals per Day" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {mealsOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Checkbox checked={selectedMeals.indexOf(option.value) > -1} />
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
           <FormControl fullWidth>
            <InputLabel id="diet-label"><FitnessCenter sx={{fontSize: 18, verticalAlign: 'middle', mr: 0.5}}/> Dietary Restrictions</InputLabel>
            <Select
              labelId="diet-label"
              id="diet-select"
              multiple
              value={selectedDiets}
              onChange={handleDietChange}
              input={<OutlinedInput label="Dietary Restrictions" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {dietOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  <Checkbox checked={selectedDiets.indexOf(option) > -1} />
                  <ListItemText primary={option} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
           <FormControl fullWidth>
            <InputLabel id="cuisine-label"><Public sx={{fontSize: 18, verticalAlign: 'middle', mr: 0.5}}/> Cuisine Preferences</InputLabel>
            <Select
              labelId="cuisine-label"
              id="cuisine-select"
              multiple
              value={selectedCuisines}
              onChange={handleCuisineChange}
              input={<OutlinedInput label="Cuisine Preferences" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {cuisineOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  <Checkbox checked={selectedCuisines.indexOf(option) > -1} />
                  <ListItemText primary={option} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

         {/* Add more inputs here: exclude ingredients, max budget? */}
      </Grid>

      {/* Generate Button */}
      <Button
        variant="contained"
        size="large"
        onClick={generateMealPlan}
        disabled={loading || selectedMeals.length === 0 || !BACKEND_URL} // Disable if URL is missing
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Search />}
        sx={{
          width: '100%',
          py: { xs: 1.5, md: 2 },
          fontSize: { xs: '1rem', md: '1.1rem' },
          fontWeight: 600,
          borderRadius: 3,
          background: `linear-gradient(45deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          '&:hover': {
            background: `linear-gradient(45deg, ${theme.palette.info.dark}, ${theme.palette.info.main})`,
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.16)',
          },
          '&:disabled': {
             background: theme.palette.grey[300],
             color: theme.palette.grey[500],
          }
        }}
      >
        {loading ? 'Generating Plan...' : `Generate Meal Plan for ${days} Day${days > 1 ? 's' : ''}`}
      </Button>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Generated Meal Plan and Grocery List */}
      {mealPlan && !loading && !error && (
        <Box sx={{ mt: { xs: 3, md: 4 } }}>
           <Typography variant="h5" gutterBottom fontWeight={600}>
             📅 Your Meal Plan
           </Typography>

           {mealPlan.map((dayPlan) => (
              <Accordion key={dayPlan.day} defaultExpanded elevation={1} sx={{ mb: 1 }}>
                 <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" fontWeight={600}>Day {dayPlan.day}</Typography>
                 </AccordionSummary>
                 <AccordionDetails>
                    <Grid container spacing={2}>
                        {dayPlan.meals.map((meal, mealIndex) => (
                           <Grid item xs={12} key={mealIndex}>
                              <Card variant="outlined" sx={{ bgcolor: theme.palette.grey[50] }}>
                                 <CardContent sx={{ py: 1.5, px: 2 }}>
                                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                                       {meal.type}:
                                    </Typography>
                                    {meal.recipe ? (
                                       // If a recipe was found
                                       <MuiLink
                                           component="button"
                                           variant="body1"
                                           onClick={() => onRecipeClick(meal.recipe.id)}
                                           sx={{ textAlign: 'left' }}
                                       >
                                           {meal.recipe.title}
                                       </MuiLink>
                                    ) : (
                                       // If no recipe was found, show the suggestion
                                       <Typography variant="body1" color="textSecondary" fontStyle="italic">
                                           {meal.recipeSuggestion || 'No suggestion'}
                                           {meal.recipeSuggestion && " (Recipe not found)"}
                                       </Typography>
                                    )}
                                 </CardContent>
                              </Card>
                           </Grid>
                        ))}
                    </Grid>
                 </AccordionDetails>
              </Accordion>
           ))}


           {/* Grocery List */}
           {/* Add check if the plan has ANY recipes found before showing grocery list messages/list */}
           {mealPlan.some(day => day.meals.some(meal => meal.recipe)) ? (
               groceryList && groceryList.length > 0 ? (
                  <Box sx={{ mt: { xs: 3, md: 4 } }}>
                    <Typography variant="h5" gutterBottom fontWeight={600}>
                      🛒 Grocery List
                    </Typography>
                     {/* Added ShoppingBasketOutlined icon */}
                     <Typography variant="subtitle1" color="textSecondary" sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                         <ShoppingBasketOutlined sx={{mr: 1}}/> Items needed for your plan:
                     </Typography>
                     <List dense sx={{ columns: { xs: 1, sm: 2, md: 3 } }}> {/* Multi-column list */}
                        {groceryList.map((item, index) => (
                           <ListItem key={index} disablePadding>
                              <ListItemText primary={`• ${item}`} />
                           </ListItem>
                        ))}
                     </List>
                  </Box>
               ) : (
                  // If grocery list is empty but some recipes were found
                   <Alert severity="info" sx={{ mt: { xs: 2, md: 3 } }}>
                       No ingredients were added to the grocery list. This might happen if the Spoonacular API did not return ingredient details for the found recipes.
                   </Alert>
               )
           ) : (
              // If NO recipes were found for ANY meal slot
              <Alert severity="warning" sx={{ mt: { xs: 2, md: 3 } }}>
                   No recipes were found matching the AI's suggestions and your criteria. The grocery list cannot be generated. Please try generating the plan again with different criteria.
               </Alert>
           )}

        </Box>
      )}
       {/* Optional: Loading state for meal planner if different */}
       {/* {loading && <LoadingState message="Generating your personalized meal plan..." />} */}
    </Paper>
  );
};

export default MealPlanner;
