# 🍳 Smart Recipe Finder & Meal Planner

An AI-powered web application to help users discover recipes based on ingredients they have and generate personalized meal plans with automated grocery lists.

This project was built step-by-step as a portfolio piece, showcasing modern web development practices, API integration, and AI capabilities using entirely free resources.

## ✨ Features

*   **Ingredient-Based Recipe Search:** Find recipes using the ingredients you currently have in your kitchen.
*   **AI Natural Language Search:** Ask the AI Chef for recipes using plain English (e.g., "healthy vegetarian dinner recipes").
*   **Detailed Recipe View:** Click on any recipe to view full instructions, ingredients, and basic nutrition information in a modal.
*   **AI Meal Planning:** Generate a multi-day meal plan based on your preferences (days, meals per day, diet, cuisine).
*   **Automatic Grocery List:** Get a combined list of ingredients needed for your generated meal plan.
*   **Responsive UI:** A clean and user-friendly interface built with Material-UI, optimized for both mobile and desktop.
*   **Robust Error Handling:** User-friendly messages for API errors, parsing issues, and no results found.

## 🛠 Tech Stack (Built with Free Resources!)

*   **Frontend:**
    *   React.js
    *   Material-UI (for UI components and styling)
    *   Axios (for API calls)
*   **Backend:**
    *   Node.js
    *   Express.js (for the API server)
    *   Axios (for external API calls - Spoonacular)
    *   `@huggingface/inference` (for AI communication)
    *   `dotenv` (for environment variables)
*   **External APIs (Free Tiers Used):**
    *   Spoonacular API (Recipe data, search, details)
    *   Hugging Face Inference API (AI model hosting and inference - specifically `mistralai/Mistral-7B-Instruct-v0.3`)
*   **Hosting (Future/Optional - Free Tiers):**
    *   Frontend: Vercel / Netlify
    *   Backend: Render / Railway / Fly.io
    *   Database: MongoDB Atlas (Free Tier - Not yet implemented, but planned for saving data)

## 🚀 Development Phases

This project was developed incrementally over several phases:

### Phase 1: Project Foundation
*   Set up the basic project structure (`client`/`server`).
*   Initialized Node.js/Express backend and React frontend.
*   Established basic communication between the frontend and backend.
*   Configured environment variables (`dotenv`) for API keys.

### Phase 2: Core Recipe Search
*   Integrated the Spoonacular API for fetching recipe data.
*   Implemented backend endpoints (`/api/recipes/*`) for searching recipes by ingredients.
*   Built the frontend UI component (`IngredientInput.js`) for adding ingredients.
*   Created frontend components (`RecipeCard.js`) to display recipe search results.
*   Established the flow from inputting ingredients to displaying recipes.

### Phase 3: Initial AI Integration (Natural Language Search)
*   Integrated the Hugging Face Inference API using the `@huggingface/inference` client library.
*   Set up the backend AI service (`aiService.js`) to communicate with a language model (`mistralai/Mistral-7B-Instruct-v0.3`).
*   Designed a system prompt for the AI to interpret natural language recipe search queries and extract parameters (ingredients, diet, cuisine, etc.) as JSON.
*   Created a backend endpoint (`/api/ai/analyze-query`) to handle AI search requests.
*   Implemented the frontend UI section for the "Ask the AI Chef!" natural language input.
*   Connected the AI search input to the backend, using the AI's output to perform a Spoonacular search.

### Phase 4: Planning & Details
*   **Part 1: Recipe Detail Modal:**
    *   Verified the existing backend endpoint (`/api/recipes/details/:id`) for fetching single recipe details.
    *   Created a frontend Material-UI Modal component (`RecipeDetailModal.js`) to display comprehensive recipe information (instructions, full ingredients, nutrition).
    *   Connected the "View Recipe" button on recipe cards to open this modal.
*   **Part 2: AI Meal Planning Backend:**
    *   Created a new backend endpoint (`/api/meal-plan/generate`) to handle meal plan requests.
    *   Designed a *separate*, specific system prompt for the AI to generate a meal plan structure (days, meals, recipe suggestions) and a grocery list as JSON.
    *   Implemented backend logic to send meal planning criteria to the AI service (using the new AI method for generation).
    *   Added logic to parse the AI's meal plan response and use Spoonacular to find actual recipes matching the AI's suggestions.
    *   Developed logic to consolidate ingredients from the found recipes into a single grocery list.
*   **Part 3: Meal Planning Frontend:**
    *   Created a dedicated frontend component (`MealPlanner.js`) for the meal planning feature.
    *   Added UI controls (selects, checkboxes) for users to define meal plan criteria (days, meals per day, diet, cuisine).
    *   Implemented the button to trigger the backend meal plan generation endpoint.
    *   Created UI sections to display the structured meal plan and the grocery list.
    *   Ensured planned recipe titles link back to the Recipe Detail Modal.

### Ongoing Refinements (Interspersed):
*   Implemented robust error handling with user-friendly messages for API failures, parsing issues, and scenarios with no results.
*   Refined UI spacing and responsiveness using Material-UI's `sx` prop with breakpoint values (`{ xs: ..., md: ... }`).
*   Addressed various debugging issues including API key configuration checks, external API endpoint corrections, AI JSON parsing robustness, and clarifying distinct AI tasks.

## ⚙️ Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd smart-recipe-finder
    ```
2.  **Set up the backend:**
    ```bash
    cd server
    npm install
    ```
3.  **Create `.env` file** in the `server` directory with your API keys:
    ```env
    SPOONACULAR_API_KEY=your_spoonacular_api_key_here
    HF_API_TOKEN=your_huggingface_api_token_here
    ```
    *   Get your Spoonacular key: [Spoonacular API](https://spoonacular.com/food-api) (Free tier available).
    *   Get your Hugging Face token: [Hugging Face Settings -> Access Tokens](https://huggingface.co/settings/tokens) (Free Inference API tier available).
4.  **Start the backend:**
    ```bash
    npm run dev
    ```
5.  **Set up the frontend:**
    ```bash
    cd ../client
    npm install
    ```
6.  **Start the frontend:**
    ```bash
    npm start
    ```
7.  Open your browser to `http://localhost:5000`.

## 🔮 Future Enhancements

*   **User Accounts:** Allow users to save favorite recipes, generated meal plans, and grocery lists (Requires database integration like MongoDB Atlas).
*   **Photo-to-Recipe:** Integrate an image recognition AI (like Google Vision or Hugging Face models) to identify food from photos and find recipes.
*   **Ingredient Substitution AI:** Allow AI to suggest alternative ingredients based on dietary needs or availability.
*   **Recipe Customization:** AI helps users adjust recipe instructions (e.g., "make this vegan," "make this spicier").
*   **Unit Conversion:** Add tools for ingredient unit conversions.
*   **Print/Export:** Option to print or export grocery lists and meal plans.
*   **Deployment:** Deploy the application to live hosting environments.

---
