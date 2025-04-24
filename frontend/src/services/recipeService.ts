
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

export const fetchRecipe = async ( type: string,prompt: string): Promise<Recipe> => {
  try {
    console.log("Sending recipe request with prompt:", prompt,type);

    const requestBody =
      type === "user_prompt"
        ? { user_prompt: prompt }
        : { image_url: prompt };
    console.log("Request body:", requestBody);
    const response = await fetch(
      "https://gem-api-adv.vercel.app/get_recipe",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();

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

