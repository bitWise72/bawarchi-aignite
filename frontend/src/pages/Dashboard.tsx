import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Save, List } from "lucide-react"
import RecipeTimeline from "@/components/RecipeTimeline"
import IngredientsPanel from "@/components/IngredientsPanel"
import SavedRecipes from "@/components/SavedRecipes"
import { fetchRecipe } from "@/services/recipeService"
import type { Recipe } from "@/services/recipeService"
import { useNavigate } from "react-router-dom"
import Navbar from "@/components/Navbar"
import { useDarkMode } from "@/contexts/DarkModeContext"
import RecipeSearch from "@/components/RecipeSearch"
import ingredient_data from "./ingredient_brands_and_costs.json"
import { NutritionProfile, NutritionResponse } from "@/components/NutriPanel"
const STORAGE_KEY = "saved_recipes"
import axios from "axios"
import { useQueryClient } from "@tanstack/react-query"

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null)
  const { darkMode, setDarkMode } = useDarkMode()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [showIngredients, setShowIngredients] = useState(false)
  const [showNutrients, setShowNutrients] = useState(false)
  const [recipeName, setRecipeName] = useState("")
  const [data, setData] = useState<NutritionResponse | null>(null)
  const navigate = useNavigate()
  const [nutritionDrawerOpen, setNutritionDrawerOpen] = useState(false)
  const [selectedIngredients, setSelectedIngredients] = useState("")
  const [nutritionDataCache, setNutritionDataCache] = useState<
    Record<string, NutritionResponse>
  >({})

  interface NutritionProfileProps {
    ingredientsString: string
    isOpen: boolean
    onClose: () => void
    dark?: boolean // <-- Optional dark mode flag
  }

  // useEffect(() => {
  //   // window.speechSynthesis.cancel()
  //   if (darkMode) {
  //     document.body.classList.add("dark-mode")
  //   } else {
  //     document.body.classList.remove("dark-mode")
  //   }

  //   const params = new URLSearchParams(window.location.search)

  //   // User info handling
  //   const name = params.get("name")
  //   const email = params.get("email")
  //   const image = params.get("image")
  //   const id = params.get("id")

  //   if (name && email && image && id) {
  //     const userData = { name, email, image, id }
  //     localStorage.setItem("user", JSON.stringify(userData))
  //     setUser(userData)
  //   } else {
  //     const storedUser = localStorage.getItem("user")
  //     if (storedUser) {
  //       try {
  //         setUser(JSON.parse(storedUser))
  //       } catch (e) {
  //         console.error("Failed to parse stored user", e)
  //       }
  //     }
  //   }

  //   const recipeText = params.get("recipeText")
  //     ? decodeURIComponent(params.get("recipeText"))
  //     : null
  //   const imageUrl = params.get("imageUrl")
  //     ? decodeURIComponent(params.get("imageUrl"))
  //     : null
  //   const modeParam = params.get("mode") || "normal"

  //   console.log("Recipe Text:", recipeText)
  //   console.log("Image URL:", imageUrl)
  //   console.log("Mode:", modeParam)

  //   // Extract recipe name from recipeText if available
  //   if (recipeText && recipeText.includes("RecipeName:")) {
  //     const nameMatch = recipeText.match(/RecipeName:(.*?)(?:\n|$)/)
  //     if (nameMatch && nameMatch[1]) {
  //       setRecipeName(nameMatch[1].trim())
  //     } else {
  //       setRecipeName("Untitled Recipe")
  //     }
  //   }
  //   // Process data based on priority: 1) recipe details, 2) recipe name, 3) food image, 4) recipe image
  //   const processData = async () => {
  //     setLoading(true)
  //     try {
  //       // console.log("😁😁😁😁😁😁😁😁😁😁😁😁😁")

  //       // Priority 1: Recipe details (full text)
  //       if (recipeText) {
  //         console.log("Processing recipe details")
  //         let recipeName
  //         if (recipeText.includes("RecipeName:")) {
  //           console.log("RecipeName found in recipeText")

  //           recipeName = recipeText.split("RecipeName:")[1].split("&&&")[0]
  //         } else {
  //           recipeName = recipeText
  //         }
  //         const data = await fetchRecipe("user_prompt", recipeText)
  //         console.log("Recipe data:", data)
  //         setRecipeName(recipeName)
  //         // setRecipeName(recipeText)
  //         // console.log(data);
  //         setRecipe(data)
  //         // console.log("😁😁😁😁😁😁😁😁😁😁😁😁😁")

  //         toast.success("Recipe processed successfully!")
  //       }
  //       // Priority 2: Image
  //       else if (imageUrl) {
  //         console.log("Processing image")
  //         setRecipeName("Untitled Recipe")
  //         const data = await fetchRecipe("image_url", imageUrl)
  //         console.log("Recipe data:", data)

  //         setRecipe(data)
  //         toast.success("Recipe extracted from image successfully!")
  //       }
  //     } catch (error) {
  //       const errorMessage =
  //         error instanceof Error
  //           ? error.message
  //           : "An unexpected error occurred"
  //       console.error("Error processing recipe data:", error)
  //       setError(errorMessage)
  //       toast.error(`Failed to process recipe: ${errorMessage}`)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   // Process data if any recipe-related param exists
  //   if (recipeText || imageUrl) {
  //     processData()
  //   }

  //   return () => {
  //     window.speechSynthesis.cancel() // Cleanup speech synthesis on unmount
  //   }
  // }, [darkMode])

  // Handle dark mode changes separately
useEffect(() => {
  if (darkMode) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}, [darkMode]);

// Handle user data and recipe processing
useEffect(() => {
  // window.speechSynthesis.cancel()
  const params = new URLSearchParams(window.location.search);

  // User info handling
  const name = params.get("name");
  const email = params.get("email");
  const image = params.get("image");
  const id = params.get("id");

  if (name && email && image && id) {
    const userData = { name, email, image, id };
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  } else {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
  }

  const recipeText = params.get("recipeText")
    ? decodeURIComponent(params.get("recipeText"))
    : null;
  const imageUrl = params.get("imageUrl")
    ? decodeURIComponent(params.get("imageUrl"))
    : null;
  const modeParam = params.get("mode") || "normal";

  console.log("Recipe Text:", recipeText);
  console.log("Image URL:", imageUrl);
  console.log("Mode:", modeParam);

  // Extract recipe name from recipeText if available
  if (recipeText && recipeText.includes("RecipeName:")) {
    const nameMatch = recipeText.match(/RecipeName:(.*?)(?:\n|$)/);
    if (nameMatch && nameMatch[1]) {
      setRecipeName(nameMatch[1].trim());
    } 
    // else {
    //   setRecipeName("Untitled Recipe");
    // }
  }

  // Process data based on priority: 1) recipe details, 2) recipe name, 3) food image, 4) recipe image
  const processData = async () => {
    setLoading(true);
    try {
      // Priority 1: Recipe details (full text)
      // if(recipeText && imageUrl) {
      //   let recipeName;
      //   if (recipeText.includes("RecipeName:")) {
      //     console.log("RecipeName found in recipeText");
      //     recipeName = recipeText.split("RecipeName:")[1].split("&&&")[0];
      //   } else {
      //     recipeName = recipeText;
      //   }
      //   const data = await fetchRecipe({ "user_prompt": recipeText, "image_url": imageUrl });
      // }
       if (recipeText) {
        // console.log("Processing recipe details");
        let recipeName;
        if (recipeText.includes("RecipeName:")) {
          console.log("RecipeName found in recipeText");
          recipeName = recipeText.split("RecipeName:")[1].split("&&&")[0];
        } else {
          recipeName = recipeText;
        }
        const data = await fetchRecipe("user_prompt", recipeText);
        // console.log("Recipe data:", data);
        setRecipeName(recipeName);
        setRecipe(data);
        toast.success("Recipe processed successfully!");
      }
      // Priority 2: Image
      else if (imageUrl) {
        // console.log("Processing image");
        setRecipeName("Recipe");
        const data = await fetchRecipe("image_url", imageUrl);
        // console.log("name",data['step 1'])
        setRecipeName(String(data['step 1'].name || 'ABC'));
        console.log("Recipe data:", data);
        setRecipe(data);
        toast.success("Recipe extracted from image successfully!");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred";
      console.error("Error processing recipe data:", error);
      setError(errorMessage);
      toast.error(`Failed to process recipe: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Process data if any recipe-related param exists
  if (recipeText || imageUrl) {
    processData();
  }

  return () => {
    window.speechSynthesis.cancel(); // Cleanup speech synthesis on unmount
  };
}, []); // Empty dependency array means this runs only once on mount

  const handleSearch = async (query: string) => {
    setLoading(true)
    setError(null)
    setCurrentStep(0)
    setRecipeName(query)
    window.speechSynthesis.cancel() // Stop any ongoing speech synthesis
    try {
      const data = await fetchRecipe("user_prompt", query)
      const dataArray = Object.values(data) // Convert object to array
      const sortedData = dataArray.sort(
        (a, b) => Number(a.time) - Number(b.time)
      ) // Sort by time
      const newData: Recipe = sortedData.reduce((acc, step, index) => {
        acc[`step${index + 1}`] = step
        return acc
      }, {} as Recipe)

      setRecipe(newData)

      if (Object.keys(data).length > 0) {
        const firstStep = data[Object.keys(data)[0]]
        const speech = new SpeechSynthesisUtterance(firstStep.procedure)
        window.speechSynthesis.speak(speech)
        const url = new URL(window.location.href);
        url.searchParams.delete('imageUrl');
        url.searchParams.set("recipeText", query);
        window.history.pushState({}, '', url);
      }

      toast.success("Recipe found successfully!")
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred"
      console.error("Error:", error)
      setError(errorMessage)
      toast.error(`Failed to get recipe: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenNutrition = (ingredientsString: string) => {
    setSelectedIngredients(ingredientsString)
    setNutritionDrawerOpen(true)
  }

  const handleSaveNutritionData = (key: string, data: NutritionResponse) => {
    setNutritionDataCache((prev) => ({ ...prev, [key]: data }))
  }

  const anyStep = (step: string) => {
    window.speechSynthesis.cancel() // Stop any ongoing speech synthesis
    const stepNum = step.split("step")[1];
    if (!recipe) return

    const steps = Object.keys(recipe)

    if (Number(stepNum) - 1 < steps.length) {
      // console.log("something")
      setCurrentStep(Number(stepNum) - 1)
      const stepData = recipe[steps[Number(stepNum) - 1]]
      // console.log("stepData", stepData)
      const speech = new SpeechSynthesisUtterance(stepData.procedure)
      window.speechSynthesis.speak(speech)
    }
  }

  const handleNextStep = () => {
    if (!recipe) return

    const steps = Object.keys(recipe)
    if (currentStep < steps.length - 1) {
      window.speechSynthesis.cancel()
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)

      const stepData = recipe[steps[nextStep]]
      const speech = new SpeechSynthesisUtterance(stepData.procedure)
      window.speechSynthesis.speak(speech)
    }
  }

  const handleSaveRecipe = () => {
    if (!recipe) return

    if (!recipeName.trim()) {
      toast.error("Please enter a recipe name before saving")
      return
    }

    try {
      const savedData = {
        lastRecipe: recipe,
        savedAt: new Date().toISOString(),
        recipeName: recipeName || "Unnamed Recipe",
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData))
      toast.success("Recipe saved successfully!")
    } catch (e) {
      console.error("Failed to save recipe", e)
      toast.error("Failed to save recipe")
    }
  }

  const handleUpdateIngredient = (ingredient: string, newQuantity: string) => {
    if (!recipe) return

    const updatedRecipe = JSON.parse(JSON.stringify(recipe)) as Recipe

    Object.keys(updatedRecipe).forEach((stepKey) => {
      const step = updatedRecipe[stepKey]
      step.measurements = step.measurements.map(([ing, qty]) =>
        ing === ingredient ? [ing, newQuantity] : [ing, qty]
      )
    })

    setRecipe(updatedRecipe)
    toast.success(`Updated ${ingredient} to ${newQuantity}`)
  }

  const handleSellRecipe = () => {
    if (!recipe) return

    navigate("/create-listing", {
      state: {
        recipe: recipe,
        recipeName: recipeName,
      },
    })
  }

  const handlePost = () => {
    if (!recipe) return

    navigate("/review-post", {
      state: {
        recipe,
        recipeName,
      },
    })
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        name={user?.name}
        image={user?.image}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-2">
        <div className="space-y-8">
          <div className="space-y-6">
            <RecipeSearch onSearch={handleSearch} darkMode={darkMode} />

            {recipe && !loading && (
              <div className="mt-2 mb-6">
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="flex-grow max-w-xs">
                    <label
                      htmlFor="recipe-name"
                      className="block text-sm font-medium mb-1"
                    >
                      Recipe Name
                    </label>
                    <input
                      type="text"
                      id="recipe-name"
                      value={recipeName}
                      onChange={(e) => setRecipeName(e.target.value)}
                      placeholder="Enter recipe name"
                      className="recipe-name-input"
                      required
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setShowIngredients(true)}
                      className={`flex items-center px-4 py-2 rounded-lg ${
                        darkMode
                          ? "bg-gray-700 hover:bg-gray-600 text-white "
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300"
                      } transition-colors`}
                      aria-label="View precise ingredients"
                    >
                      <List className="h-4 w-4 mr-2" />
                      <span className="text-sm">Ingredients</span>
                    </button>

                    <button
                      // onClick={async () => {
                      //   const payload = { ingredients_string: JSON.stringify(recipe) };
                      //   const resp = await axios.post<NutritionResponse>(
                      //     'https://gem-api-adv.vercel.app/get_nutri',
                      //     payload,
                      //     { headers: { 'Content-Type': 'application/json' } }
                      //   );
                      //   setData(resp.data);
                      //   console.log(resp.data);
                      //   setShowNutrients(true)
                      // }}
                      onClick={() =>
                        handleOpenNutrition(JSON.stringify(recipe))
                      }
                      className={`flex items-center px-4 py-2 rounded-lg ${
                        darkMode
                          ? "bg-gray-700 hover:bg-gray-600 text-white "
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300"
                      } transition-colors`}
                      aria-label="View precise ingredients"
                    >
                      <List className="h-4 w-4 mr-2" />
                      <span className="text-sm">Nutrition</span>
                    </button>

                    <button
                      onClick={handleSaveRecipe}
                      className="btn-primary flex items-center"
                      aria-label="Save recipe"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      <span className="text-sm">Save</span>
                    </button>

                    {/* <button
                      onClick={handleSellRecipe}
                      className="flex items-center btn-primary"
                      aria-label="Sell this recipe"
                    >
                      <List className="mr-2" />
                      <span className="text-sm">Sell Recipe</span>
                    </button>  */}
                    <button
                      onClick={handlePost}
                      className="flex items-center btn-primary"
                      aria-label="Sell this recipe"
                    >
                      <span className="text-sm">Post</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4">Finding your recipe...</p>
              </div>
            )}

            {error && !loading && (
              <div
                className={`${
                  darkMode
                    ? "bg-red-900/20 border-red-900/30 text-red-300"
                    : "bg-red-50 border-red-200 text-red-600"
                } border rounded-lg p-4 text-center`}
              >
                <p>{error}</p>
                <p className="text-sm mt-2">
                  Try a different recipe or check your connection.
                </p>
              </div>
            )}

            {recipe && !loading && (
              <RecipeTimeline
                recipe={recipe}
                onNextStep={handleNextStep}
                currentStep={currentStep}
                darkMode={darkMode}
                anyStep={anyStep}
              />
            )}
          </div>

          <div className="border-t pt-8">
            <SavedRecipes darkMode={darkMode} />
          </div>
        </div>
      </main>

      {showIngredients && recipe && (
        <IngredientsPanel
          recipe={recipe}
          onClose={() => setShowIngredients(false)}
          onUpdateIngredient={handleUpdateIngredient}
          darkMode={darkMode}
          marketplaceData={ingredient_data}
        />
      )}

      {/* 
    <NutritionProfile
      ingredientsString={JSON.stringify(recipe)}
      isOpen={showNutrients}
      onClose={() => setShowNutrients(false)}
      dark={darkMode}
    /> */}

      <NutritionProfile
        ingredientsString={selectedIngredients}
        isOpen={nutritionDrawerOpen}
        onClose={() => setNutritionDrawerOpen(false)}
        cachedData={nutritionDataCache[selectedIngredients]}
        saveData={handleSaveNutritionData}
        dark={darkMode} // or false based on theme
      />
    </div>
  )
}

export default Dashboard
