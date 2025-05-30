const express = require('express');
const recipeService = require('../services/recipeService');
const router = express.Router();

// Search recipes by ingredients
router.post('/search-by-ingredients', async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Please provide at least one ingredient' });
    }

    const recipes = await recipeService.findByIngredients(ingredients);
    
    res.json({
      success: true,
      recipes: recipes,
      count: recipes.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recipe details
router.get('/details/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await recipeService.getRecipeDetails(id);
    
    res.json({
      success: true,
      recipe: recipe
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search recipes with query
router.get('/search', async (req, res) => {
  try {
    const { q, diet, number } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results = await recipeService.searchRecipes(q, diet, number);
    
    res.json({
      success: true,
      recipes: results.results,
      totalResults: results.totalResults
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get random recipes
router.get('/random', async (req, res) => {
  try {
    const { number, tags } = req.query;
    const results = await recipeService.getRandomRecipes(number, tags);
    
    res.json({
      success: true,
      recipes: results.recipes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;