import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useDarkMode } from "@/contexts/DarkModeContext";

const SharedRecipePage = () => {
  const { id } = useParams<{ id: string }>();
  const { darkMode } = useDarkMode();

  interface Step {
    procedure: string;
    measurements: [string, string][];
    time?: string | number | null;
  }

  interface Post {
    title: string;
    description: string;
    imageUrl: string[];
    recipe: Record<string, Step>;
  }

  interface RecipeData {
    name: string;
    picture: string;
    posts: Post;
  }

  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_PORT}/auth/getIdRecipe`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ recipeId: id }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data?.recipe) throw new Error("Recipe data not found");
        setRecipeData(data.recipe);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecipe();
  }, [id]);

  const formatTime = (time?: string | number | null): string => {
    if (time === null || time === undefined || time === '') return "Not specified"
  
    const timeString = String(time)
  
    return timeString.replace(/[()]/g, "") + " mins"
  }
  

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  if (!recipeData) return <div className="text-center mt-10">No recipe found</div>;

  const { name, picture, posts } = recipeData;
  const { title, description, imageUrl, recipe } = posts;
  const steps = Object.entries(recipe);

  return (
    <div
      className={`max-w-5xl mx-auto px-4 py-6 min-h-screen rounded-2xl shadow-md ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-indigo-50 text-gray-900"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {imageUrl?.[0] && (
          <img
            src={imageUrl[0]}
            alt={title}
            crossOrigin="anonymous"
            className="w-full rounded-2xl object-cover max-h-[400px] shadow-md"
          />
        )}

        <h1
          className={`text-4xl font-extrabold mt-6 ${
            darkMode ? "text-indigo-300" : "text-indigo-700"
          }`}
        >
          {title}
        </h1>
        <p
          className={`mt-2 italic ${
            darkMode ? "text-indigo-200" : "text-indigo-600"
          }`}
        >
          {description}
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          {picture && (
            <img
              src={picture}
              alt={name}
              className="w-10 h-10 rounded-full border border-indigo-300"
            />
          )}
          <span
            className={`text-sm ${
              darkMode ? "text-indigo-300" : "text-indigo-500"
            }`}
          >
            Shared by {name}
          </span>
        </div>
      </motion.div>

      <Separator
        className={`my-6 ${darkMode ? "bg-gray-700" : "bg-indigo-200"}`}
      />

      <div className="space-y-6">
        {steps.map(([stepKey, step], index) => (
          <motion.div
            key={stepKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`shadow-lg hover:shadow-xl transition duration-200 ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-indigo-100"
              }`}
            >
              <CardContent className="p-6 space-y-4">
                <h2
                  className={`text-xl font-bold ${
                    darkMode ? "text-indigo-300" : "text-indigo-700"
                  }`}
                >
                  Step {index + 1}
                </h2>
                <p
                  className={`whitespace-pre-line ${
                    darkMode ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  {step.procedure}
                </p>

                {step.measurements?.length > 0 && (
                  <ul
                    className={`list-disc list-inside mt-2 ${
                      darkMode ? "text-indigo-200" : "text-indigo-900"
                    }`}
                  >
                    {step.measurements.map(([ingredient, quantity], i) => (
                      <li key={i}>
                        <span className="font-semibold">{ingredient}</span>: {quantity}
                      </li>
                    ))}
                  </ul>
                )}

                <p
                  className={`text-sm ${
                    darkMode ? "text-indigo-400" : "text-indigo-500"
                  }`}
                >
                  Estimated Time: {formatTime(step.time)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SharedRecipePage;