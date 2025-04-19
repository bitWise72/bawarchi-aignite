
interface RecipeMeasurement {
  ingredient: string;
  quantity: string;
}

interface RecipeStep {
  procedure: string;
  measurements: [string, string][];
  time: [number | null, number | null];
}

export interface Recipe {
  [key: string]: RecipeStep;
}

export const fetchRecipe = async (prompt: string): Promise<Recipe> => {
  try {
    console.log("Sending recipe request with prompt:", prompt);
    const response = await fetch(
      "https://gem-recipe-nopp4bs5f-sayan-gangulys-projects.vercel.app/get_recipe",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_prompt: prompt }),
      }
    );

    const data = await response.json();
    
    // Check if the response contains an error
    if (!response.ok || data.error) {
      const errorMessage = data.error || "Failed to fetch recipe";
      console.error("API error:", errorMessage);
      throw new Error(errorMessage);
    }

    console.log("Recipe response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching recipe:", error);
    throw error;
  }
};
