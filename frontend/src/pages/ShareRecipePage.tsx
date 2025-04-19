import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const SharedRecipePage = () => {
  const { id } = useParams()

  interface Step {
    procedure: string
    measurements: [string, string][]
    time?: string
  }

  interface Post {
    title: string
    description: string
    imageUrl: string[]
    recipe: Record<string, Step>
  }

  interface RecipeData {
    name: string
    picture: string
    posts: Post
  }

  const [recipeData, setRecipeData] = useState<RecipeData | null>(null)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_PORT}/auth/getIdRecipe`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ recipeId: id }),
          }
        )

        const data = await response.json()
        if (response.ok) {
          setRecipeData(data.recipe)
        } else {
          console.error(data.message)
        }
      } catch (error) {
        console.error("Failed to fetch recipe:", error)
      }
    }

    fetchRecipe()
  }, [id])

  if (!recipeData) return <div className="text-center mt-10">Loading...</div>

  const { name, picture, posts } = recipeData
  const { title, description, imageUrl, recipe } = posts

  const steps = Object.entries(recipe)

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 bg-indigo-50 min-h-screen rounded-2xl shadow-md">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <img
          src={imageUrl[0]}
          alt={title}
          crossOrigin="anonymous"
          className="w-full rounded-2xl object-cover max-h-[400px] shadow-md"
        />

        <h1 className="text-4xl font-extrabold mt-6 text-indigo-700">
          {title}
        </h1>
        <p className="text-indigo-600 mt-2 italic">{description}</p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <img
            src={picture}
            alt={name}
            className="w-10 h-10 rounded-full border border-indigo-300"
          />
          <span className="text-sm text-indigo-500">Shared by {name}</span>
        </div>
      </motion.div>

      <Separator className="my-6 bg-indigo-200" />

      <div className="space-y-6">
        {steps.map(([stepKey, step], index) => (
          <motion.div
            key={stepKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white shadow-lg border border-indigo-100 hover:shadow-xl transition duration-200">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-indigo-700">
                  Step {index + 1}
                </h2>
                <p className="text-gray-800 whitespace-pre-line">
                  {step.procedure}
                </p>

                {step.measurements.length > 0 && (
                  <ul className="list-disc list-inside mt-2 text-indigo-900">
                    {step.measurements.map(([ingredient, quantity], i) => (
                      <li key={i}>
                        <span className="font-semibold">{ingredient}</span>:{" "}
                        {quantity}
                      </li>
                    ))}
                  </ul>
                )}

                <p className="text-sm text-indigo-500">
                  Estimated Time: {step.time?.replace(/[()]/g, "")} mins
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default SharedRecipePage
