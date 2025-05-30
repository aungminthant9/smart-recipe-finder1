const { InferenceClient } = require("@huggingface/inference");

class AiService {
  constructor() {
    const hfApiToken = process.env.HF_API_TOKEN;
    if (!hfApiToken) {
      console.error("HF_API_TOKEN is not set in .env file!");
      this.client = null;
      return;
    }

    this.client = new InferenceClient(hfApiToken);
    this.modelId = "mistralai/Mistral-7B-Instruct-v0.3"; // Or v0.2 if preferred/more stable on free tier
  }

   // Helper for common AI calling logic
   async _callAi(messages, maxTokens, temperature = 0.2) {
       if (!this.client) {
          console.error("Hugging Face Inference Client is not initialized.");
          throw new Error("AI service is not available due to missing configuration.");
       }

       try {
           const chatCompletion = await this.client.chatCompletion({
               model: this.modelId,
               messages: messages,
               temperature: temperature,
               max_tokens: maxTokens,
           });

           const rawResponse = chatCompletion.choices?.[0]?.message?.content;

           if (!rawResponse) {
                console.error("AI returned empty or unexpected response structure:", chatCompletion);
                throw new Error("AI did not provide a valid response. It might be overloaded. Please try again.");
           }
           console.log("AI Raw Response:", rawResponse);
           return rawResponse;

       } catch (error) {
           console.error('Error calling Hugging Face Inference Client:', error);

            let userMessage = 'An error occurred communicating with the AI service.';

            if (error.status) { // Check if it's an HTTP error from the API
                if (error.status === 429) {
                    userMessage = 'AI service is currently very busy (rate limit). Please wait a moment and try again.';
                } else if (error.status === 503) {
                    userMessage = 'AI model is loading or unavailable. Please try again in a minute or two.';
                } else if (error.status === 401) {
                    userMessage = 'Hugging Face API key is invalid or missing in the backend.';
                } else if (error.status === 404) {
                     userMessage = 'AI model not found. Check the model ID configuration in the backend.';
                } else {
                     userMessage = `AI API error: Status ${error.status}. Please try again.`;
                }
            } else if (error.message) {
                 userMessage = `AI service failed: ${error.message}.`;
            }

            throw new Error(userMessage || 'An unexpected error occurred with the AI service.');
       }
   }

   // Helper for robust JSON extraction from raw response
   _extractAndParseJson(rawResponse) {
       let jsonString = rawResponse.trim();

       // Look for the first '{' and the last '}'
       const jsonStart = jsonString.indexOf('{');
       const jsonEnd = jsonString.lastIndexOf('}');

       if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            jsonString = jsonString.substring(jsonStart, jsonEnd + 1);
            jsonString = jsonString.trim();

            const cleanedJsonString = jsonString.startsWith('```json') && jsonString.endsWith('```')
               ? jsonString.substring(7, jsonString.length - 3).trim()
               : jsonString;

             return JSON.parse(cleanedJsonString);

       } else {
            console.error("AI response does not contain expected JSON structure:", rawResponse);
            throw new Error(`AI returned an unexpected format. Expected JSON but didn't find it. Raw response starts with: "${rawResponse.substring(0, Math.min(rawResponse.length, 50))}..."`);
       }
   }


  // NEW: Method specifically for analyzing a user's search query for recipes
  async analyzeSearchQuery(query) {
    const messages = [
      {
        role: "system",
        content: `You are a helpful recipe search assistant. Your task is to interpret a user's request for recipes and extract the key search parameters.
        Identify the main ingredients, dietary restrictions (like vegetarian, vegan, keto, gluten-free, etc.), meal type (breakfast, lunch, dinner, dessert), or any specific cuisine mentioned.
        Extract these key elements and format them as a JSON object with the following keys:
        {"ingredients": [], "diet": [], "mealType": "", "cuisine": "", "maxReadyTime": ""}.

        Only return the JSON object and nothing else. Ensure the JSON is valid.

        Example 1:
        User: "Show me some healthy chicken and broccoli recipes for dinner"
        Response: {"ingredients": ["chicken", "broccoli"], "diet": ["healthy"], "mealType": "dinner"}

        Example 2:
        User: "What can I bake with chocolate chips, flour, and eggs?"
        Response: {"ingredients": ["chocolate chips", "flour", "eggs"], "mealType": "dessert"}

        Example 3:
        User: "Low-carb vegetarian lunch ideas"
        Response: {"diet": ["low-carb", "vegetarian"], "mealType": "lunch"}

        Example 4:
        User: "Quick 30-minute pasta dishes"
        Response: {"ingredients": ["pasta"], "maxReadyTime": 30}

        If the query is not clear or you can't extract structured data, return an empty JSON object {}.
        ` // This prompt is now ONLY focused on extraction for searching
      },
      {
        role: "user",
        content: query
      }
    ];

    const rawResponse = await this._callAi(messages, 300); // Use a lower token limit as output is small

    try {
        const parsedResponse = this._extractAndParseJson(rawResponse);
        // Check if the parsed response is an empty object, indicating AI couldn't extract
        if (Object.keys(parsedResponse).length === 0) {
            return { fallback: "The AI couldn't extract search criteria from your request. Try being more specific." };
        }
        // Return the parsed JSON for recipe search parameters
        return parsedResponse;

    } catch (parseError) {
        // This catch handles errors from _extractAndParseJson
        console.error('Error parsing AI search response:', parseError.message);
        throw new Error(`AI returned an invalid format for search criteria. ${parseError.message}`);
    }
  }


  // NEW: Method specifically for generating a meal plan and grocery list
  async generateMealPlanAiResponse(criteriaPrompt) {
      const messages = [
        {
          role: "system",
          content: `You are a helpful meal planning assistant. Generate a meal plan and grocery list based on the following criteria: ${criteriaPrompt}

          For each meal, suggest a concise recipe name or description that fits the criteria. Do NOT include recipe IDs.
          After the meal plan, generate a combined grocery list for all suggested recipes, listing ingredients needed. Be concise.

          Format your response as a JSON object with the following keys:
          {
            "mealPlan": [
              {
                "day": 1,
                "meals": [
                  { "type": "Breakfast", "recipeSuggestion": "Suggested Breakfast Recipe Name" },
                  // ... other meals for the day
                ]
              },
              // ... meal plan for other days
            ],
            "groceryList": ["ingredient 1", "ingredient 2", "ingredient 3", "..."] // Simple list of ingredients
          }

          Only return the JSON object and nothing else. Ensure the JSON is valid and complete.
          ` // This prompt is NOW ONLY focused on meal plan generation
        },
        {
          role: "user",
          content: `Generate a meal plan based on the provided criteria.` // Simple user message to trigger the system prompt
        }
      ];

      const rawResponse = await this._callAi(messages, 1000); // Use a higher token limit for generation

      try {
          const parsedResponse = this._extractAndParseJson(rawResponse);
           // Check if the parsed response has the expected mealPlan structure
          if (!parsedResponse.mealPlan || !Array.isArray(parsedResponse.mealPlan)) {
             console.error("AI generated JSON but it's missing or invalid 'mealPlan' key:", parsedResponse);
             throw new Error("AI generated an invalid meal plan structure. Please try again.");
          }
          // Return the parsed JSON for the meal plan
          return parsedResponse;

      } catch (parseError) {
         // This catch handles errors from _extractAndParseJson OR the mealPlan structure check
          console.error('Error parsing AI meal plan response:', parseError.message);
          throw new Error(`AI returned an invalid format for meal plan. ${parseError.message}`);
      }
  }

}

const aiServiceInstance = new AiService();
if (!aiServiceInstance || !aiServiceInstance.client) {
  console.warn("AI Service disabled due to missing HF_API_TOKEN.");
}

module.exports = aiServiceInstance;