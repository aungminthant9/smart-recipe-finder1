const axios = require('axios');

class RecipeService {
  constructor() {
    this.apiKey = process.env.SPOONACULAR_API_KEY;
    this.baseURL = 'https://api.spoonacular.com/recipes';
  }

  // Helper to get detailed error message from axios error
  _getErrorMessage(error, defaultMessage) {
      if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const status = error.response.status;
          const data = error.response.data;
          let message = `API error: Status ${status}.`;
          if (data && data.message) { // Spoonacular often includes a message
              message += ` ${data.message}`;
          } else if (data && typeof data === 'string') {
               message += ` ${data}`;
          }
          console.error(`${defaultMessage} - Response Error:`, message, data);
          return `${defaultMessage}. Spoonacular API returned: ${message}`;
      } else if (error.request) {
          // The request was made but no response was received
          console.error(`${defaultMessage} - No Response:`, error.request);
          return `${defaultMessage}. No response received from Spoonacular API.`;
      } else {
          // Something happened in setting up the request that triggered an Error
          console.error(`${defaultMessage} - Request Setup Error:`, error.message);
          return `${defaultMessage}. Request failed: ${error.message}`;
      }
  }


  async findByIngredients(ingredients, number = 12) {
    try {
      const response = await axios.get(`${this.baseURL}/findByIngredients`, {
        params: {
          apiKey: this.apiKey,
          ingredients: ingredients.join(','),
          number: number,
          ranking: 1, // Minimize missing ingredients
          ignorePantry: true,
        }
      });
      return response.data;
    } catch (error) {
      // Use the helper function for consistent error messages
      throw new Error(this._getErrorMessage(error, 'Failed to fetch recipes by ingredients'));
    }
  }

  async getRecipeDetails(recipeId) {
    try {
      const response = await axios.get(`${this.baseURL}/${recipeId}/information`, {
        params: {
          apiKey: this.apiKey,
          includeNutrition: true
        }
      });
      return response.data;
    } catch (error) {
       throw new Error(this._getErrorMessage(error, `Failed to fetch recipe details for ID ${recipeId}`));
    }
  }

  async searchRecipes(query, diet = '', number = 12, cuisine = '', type = '', maxReadyTime = '') {
    try {
        const params = {
            apiKey: this.apiKey,
            query: query,
            number: number,
            addRecipeInformation: true,
            fillIngredients: true,
        };

        if (diet) params.diet = diet;
        if (cuisine) params.cuisine = cuisine;
        if (type) params.type = type;
        if (maxReadyTime) params.maxReadyTime = maxReadyTime;

        const response = await axios.get(`${this.baseURL}/complexSearch`, {
            params: params
        });

        return response.data;
    } catch (error) {
       throw new Error(this._getErrorMessage(error, 'Failed to search recipes'));
    }
  }

  async getRandomRecipes(number = 6, tags = '') {
    try {
      const response = await axios.get(`${this.baseURL}/random`, {
        params: {
          apiKey: this.apiKey,
          number: number,
          tags: tags
        }
      });
      return response.data;
    } catch (error) {
       throw new Error(this._getErrorMessage(error, 'Failed to fetch random recipes'));
    }
  }
}

module.exports = new RecipeService();