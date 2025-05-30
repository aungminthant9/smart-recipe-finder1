const express = require('express');
const recipeService = require('../services/recipeService');
const aiService = require('../services/aiService');
const router = express.Router();

router.use((req, res, next) => {
    if (!aiService || !aiService.client) {
         return res.status(500).json({ error: "AI service is not configured or initialized properly. AI features are unavailable." });
    }
    next();
});


// This route now EXPLICITLY uses the AI to ANALYZE a query for search parameters
router.post('/analyze-query', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required.' });
    }

    // Call the new method specifically designed for search analysis
    const analysis = await aiService.analyzeSearchQuery(query);

    // The method itself handles fallback if AI can't extract
    if (analysis.fallback) {
        return res.json({ success: false, message: analysis.fallback });
    }

    let recipes = [];
    let searchSuccessful = false;
    let message = "Found recipes based on your query!";

    // Use the extracted parameters from the AI's search analysis
    const ingredients = (analysis.ingredients && Array.isArray(analysis.ingredients) && analysis.ingredients.length > 0) ? analysis.ingredients : [];
    const diet = (analysis.diet && Array.isArray(analysis.diet) && analysis.diet.length > 0) ? analysis.diet.join(',') : '';
    const cuisine = analysis.cuisine || '';
    const mealType = analysis.mealType || '';
    const maxReadyTime = analysis.maxReadyTime || '';

    let searchTerm = query; // Default search term is original query

    if (ingredients.length > 0) {
        searchTerm = ingredients.join(' ');
    } else if (mealType || cuisine) {
         searchTerm = `${mealType} ${cuisine} recipes`.trim();
    }


    // Perform the complex search using the refined parameters
    try {
        const results = await recipeService.searchRecipes(
            searchTerm,
            diet,
            12, // number of recipes
            cuisine,
            mealType,
            maxReadyTime
        );

        recipes = results.results;
        searchSuccessful = true;

    } catch (searchError) {
        console.error(`Spoonacular search failed after AI analysis:`, searchError.message);
        message = `Could not find recipes matching your criteria. ${searchError.message}`;
        searchSuccessful = false;
    }

    if (searchSuccessful && recipes.length === 0) {
         message = "Found 0 recipes matching your criteria. Try a different query?";
    } else if (searchSuccessful && recipes.length > 0) {
         message = `Found ${recipes.length} recipes based on your query!`;
    }

    res.json({
      success: searchSuccessful,
      message: message,
      analysis: analysis, // Still include analysis for debugging/info if needed
      recipes: recipes
    });

  } catch (error) {
    console.error('AI Query Analysis route caught error:', error.message);
    res.status(500).json({ error: error.message || 'An unexpected error occurred while processing your search query.' }); // More specific error
  }
});

module.exports = router;