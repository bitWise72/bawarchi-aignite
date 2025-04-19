import React, { useState, useEffect } from "react"
import { X, Edit, Check } from "lucide-react"
import type { Recipe } from "@/services/recipeService"

interface IngredientsPanelProps {
  recipe: Recipe
  onClose: () => void
  onUpdateIngredient: (ingredient: string, newQuantity: string) => void
  darkMode: boolean
}
//dark mode is working
const IngredientsPanel: React.FC<IngredientsPanelProps> = ({
  recipe,
  onClose,
  onUpdateIngredient,
  darkMode,
}) => {
  const [ingredients, setIngredients] = useState<[string, string][]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")

  useEffect(() => {
    const allIngredients = new Map<string, string>()

    Object.values(recipe).forEach((step) => {
      step.measurements.forEach(([ingredient, quantity]) => {
        allIngredients.set(ingredient, quantity)
      })
    })

    setIngredients(Array.from(allIngredients.entries()))
  }, [recipe])

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setEditValue(ingredients[index][1])
  }

  const handleSave = (index: number) => {
    const ingredient = ingredients[index][0]
    const newQuantity = editValue

    const newIngredients = [...ingredients]
    newIngredients[index] = [ingredient, newQuantity]
    setIngredients(newIngredients)

    onUpdateIngredient(ingredient, newQuantity)

    setEditingIndex(null)
    setEditValue("")
  }

  const capitalizeFirst = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end animate-fade-in">
      <div
        className={`w-full max-w-md h-full overflow-y-auto shadow-xl animate-slide-in-right ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div
          className={`p-4 border-b sticky top-0 z-10 flex justify-between items-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Precise Ingredients
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              darkMode
                ? "hover:bg-gray-700 text-white"
                : "hover:bg-gray-200 text-gray-900"
            }`}
            aria-label="Close panel"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {ingredients.length === 0 ? (
            <p
              className={`italic ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No ingredients listed for this recipe.
            </p>
          ) : (
            <ul className="space-y-4">
              {ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className={`p-3 border rounded-lg transition-colors ${
                    darkMode
                      ? "border-gray-700 hover:bg-gray-700"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {capitalizeFirst(ingredient[0])}
                    </span>

                    {editingIndex === index ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className={`border rounded px-2 py-1 w-24 ${
                            darkMode
                              ? "border-gray-600 bg-gray-700 text-white"
                              : "border-gray-200 bg-white text-gray-900"
                          }`}
                          placeholder="Enter quantity"
                          aria-label="Edit ingredient quantity"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSave(index)}
                          className={`p-1 rounded ${
                            darkMode
                              ? "text-green-400 hover:bg-green-900/20"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                          aria-label="Save"
                        >
                          <Check size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <span
                          className={
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }
                        >
                          {ingredient[1]}
                        </span>
                        <button
                          onClick={() => handleEdit(index)}
                          className={`p-1 rounded ${
                            darkMode
                              ? "text-gray-400 hover:bg-gray-700"
                              : "text-gray-500 hover:bg-gray-100"
                          }`}
                          aria-label="Edit"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default IngredientsPanel
