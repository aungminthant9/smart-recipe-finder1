const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const recipeRoutes = require('./routes/recipes');
const aiService = require('./services/aiService'); // Import the AI service instance
const aiRoutes = require('./routes/ai'); // AI routes (uses aiService)
// Import the new mealPlan routes
const mealPlanRoutes = require('./routes/mealPlan'); // Meal plan routes (uses aiService and recipeService)


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// console.log('--- Debugging AI Service ---');
// console.log('Value of aiService:', aiService);
// console.log('Value of aiService.client:', aiService ? aiService.client : 'aiService is null/undefined');
// console.log('--- End Debugging ---');


// Routes
app.use('/api/recipes', recipeRoutes);

// Only mount AI-dependent routes if the AI service was successfully initialized
// aiService and recipeService are needed for mealPlan routes
if (aiService && aiService.client) { // aiRoutes needs aiService.client
    app.use('/api/ai', aiRoutes);
    console.log("AI routes mounted.");
    // mealPlanRoutes needs both aiService.client and recipeService.apiKey (checked in its middleware)
    app.use('/api/meal-plan', mealPlanRoutes);
    console.log("Meal Plan routes mounted.");

} else {
    console.warn("AI or Meal Plan routes NOT fully mounted due to missing or invalid AI service configuration.");
}


// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working! 🚀' });
});

// API status route
app.get('/api/status', (req, res) => {
  res.json({
    status: 'Online',
    spoonacularConfigured: !!process.env.SPOONACULAR_API_KEY,
    // Check for HF_API_TOKEN instead of OpenAI key
    aiConfigured: !!process.env.HF_API_TOKEN,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
  console.log(`📡 Spoonacular API: ${process.env.SPOONACULAR_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🤖 Hugging Face API: ${process.env.HF_API_TOKEN ? '✅ Configured' : '❌ Missing'}`); // Log HF status
});