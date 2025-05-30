const express = require('express');
const aiService = require('../services/aiService');
const recipeService = require('../services/recipeService');
const router = express.Router();

router.use((req, res, next) => {
    if (!aiService || !aiService.client) {
         return res.status(500).json({ error: "AI service is not configured or initialized properly. Cannot generate meal plan." });
    }
     if (!recipeService || !recipeService.apiKey) {
         return res.status(500).json({ error: "Recipe service is not configured or initialized properly. Cannot generate meal plan." });
    }
    next();
});


// This route now EXPLICITLY uses the AI to GENERATE a meal plan
router.post('/generate', async (req, res) => {
  try {
    const {
        days,
        mealsPerDay,
        diet,
        cuisine,
        // Add other preferences
    } = req.body;

    if (!days || !mealsPerDay || mealsPerDay.length === 0) {
        return res.status(400).json({ error: "Please specify number of days and meals per day for the plan." });
    }

    // Construct a specific prompt for the meal plan generation AI method
    const criteriaPrompt = `
    Plan for ${days} day${days > 1 ? 's' : ''}.
    Include the following meals each day: ${mealsPerDay.join(', ')}.
    ${diet && diet.length > 0 ? `Dietary restrictions: ${diet.join(', ')}.` : ''}
    ${cuisine && cuisine.length > 0 ? `Cuisine preferences: ${cuisine.join(', ')}.` : ''}
    `; // This prompt goes into the system message of generateMealPlanAiResponse

    console.log("Sending meal plan criteria to AI:", criteriaPrompt);

    // Call the new method specifically designed for meal plan generation
    // This method will handle the AI call and JSON parsing
    const aiResponse = await aiService.generateMealPlanAiResponse(criteriaPrompt);

    // aiResponse is expected to be the parsed {"mealPlan": [...], "groceryList": [...]} JSON object
    // The generateMealPlanAiResponse method already validates the mealPlan structure and throws if invalid
    const suggestedPlan = aiResponse.mealPlan;
    const suggestedGroceryList = aiResponse.groceryList;


     if (!suggestedGroceryList || !Array.isArray(suggestedGroceryList)) {
         console.warn("AI generated meal plan but groceryList is missing or not an array, proceeding without AI grocery list:", aiResponse);
         // Proceed without AI grocery list if it's missing
     }


    const mealPlanWithRecipes = [];
    const allIngredientsForGroceryList = new Set();

    for (const dayPlan of suggestedPlan) {
        // Ensure dayPlan structure is as expected, fallback if needed
        if (!dayPlan || !dayPlan.meals || !Array.isArray(dayPlan.meals)) {
             console.warn("Invalid day structure from AI, skipping day:", dayPlan);
             continue; // Skip this invalid day
        }
        const dayNumber = dayPlan.day || (mealPlanWithRecipes.length + 1); // Use AI's day number or generate one

        const dayWithRecipes = { day: dayNumber, meals: [] };


        for (const meal of dayPlan.meals) {
             // Ensure meal structure is as expected, fallback if needed
            if (!meal || typeof meal.type !== 'string' || typeof meal.recipeSuggestion !== 'string') {
                console.warn("Invalid meal structure from AI, skipping meal:", meal);
                continue; // Skip this invalid meal
            }

            const suggestion = meal.recipeSuggestion;
            let foundRecipe = null;

            if (suggestion) {
                try {
                    const searchResults = await recipeService.searchRecipes(
                        suggestion,
                         Array.isArray(diet) ? diet.join(',') : '',
                        1
                    );

                    if (searchResults && searchResults.results && searchResults.results.length > 0) {
                        foundRecipe = searchResults.results[0];
                        if (foundRecipe.extendedIngredients) {
                             foundRecipe.extendedIngredients.forEach(ing => {
                                 allIngredientsForGroceryList.add(ing.name.toLowerCase());
                             });
                        } else if (foundRecipe.missedIngredients && foundRecipe.usedIngredients) {
                             [...foundRecipe.missedIngredients, ...foundRecipe.usedIngredients].forEach(ing => {
                                allIngredientsForGroceryList.add(ing.name.toLowerCase());
                            });
                        }

                    } else {
                         console.warn(`No Spoonacular recipe found for AI suggestion: "${suggestion}"`);
                    }
                } catch (searchError) {
                    console.error(`Error searching Spoonacular for "${suggestion}":`, searchError.message);
                }
            }

            dayWithRecipes.meals.push({
                type: meal.type,
                recipeSuggestion: suggestion,
                recipe: foundRecipe
            });
        }
         // Only add the day if it had valid meals
        if (dayWithRecipes.meals.length > 0) {
            mealPlanWithRecipes.push(dayWithRecipes);
        }

    }

    // Sort the meal plan by day number
    mealPlanWithRecipes.sort((a, b) => a.day - b.day);


    const finalGroceryList = Array.from(allIngredientsForGroceryList).sort();

    res.json({
      success: true,
      message: "Meal plan generated!",
      mealPlan: mealPlanWithRecipes,
      groceryList: finalGroceryList
    });

  } catch (error) {
    // This catch handles errors from aiService.generateMealPlanAiResponse (parsing, invalid mealPlan structure)
    // and general errors in this route handler.
    console.error('Meal Plan Generation route caught error:', error.message);
    res.status(500).json({ error: error.message || 'An unexpected error occurred while generating the meal plan.' });
  }
});

module.exports = router;