import React, { useState, useEffect } from "react"
import { X, Edit, Check, ShoppingCart } from "lucide-react"
import type { Recipe } from "@/services/recipeService"

const ingredientBrandsCosts: IngredientMarketplaceData = {
  "rice": [
    { brand: "India Gate", cost: 150 },
    { brand: "Daawat", cost: 130 }
  ],
  "salt": [
    { brand: "Tata", cost: 20 },
    { brand: "Aashirvaad", cost: 25 }
  ]
}

interface MarketplaceOption {
  brand: string
  cost: number
}

type IngredientMarketplaceData = {
  [ingredient: string]: MarketplaceOption[]
}

interface IngredientsPanelProps {
  recipe: Recipe
  onClose: () => void
  onUpdateIngredient: (ingredient: string, newQuantity: string) => void
  darkMode: boolean
  marketplaceData?: IngredientMarketplaceData
}

function normalize(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
}


function findMatchingIngredientKey(
  ingredient: string,
  data: IngredientMarketplaceData
): string | null {
  const normalizedInput = normalize(ingredient)

  // First try exact match
  if (data[ingredient]) {
    return ingredient
  }

  // Try to find a key that includes the ingredient or vice versa
  for (const key of Object.keys(data)) {
    const normalizedKey = normalize(key)

    // Check if either string includes the other
    if (
      normalizedInput.includes(normalizedKey) ||
      normalizedKey.includes(normalizedInput)
    ) {
      return key
    }
  }

  return null
}

function getMarketplaceDataFromRecipe(
  recipe: Recipe,
  ingredientData: IngredientMarketplaceData
): IngredientMarketplaceData {
  const result: IngredientMarketplaceData = {}
  const usedIngredients = new Set<string>()

  Object.values(recipe).forEach((step) => {
    step.measurements.forEach(([ingredient]) => {
      const norm = normalize(ingredient)

      if (usedIngredients.has(norm)) return

      const matchingKey = findMatchingIngredientKey(ingredient, ingredientData)
      if (matchingKey) {
        result[ingredient] = ingredientData[matchingKey]
        usedIngredients.add(norm)
      }
    })
  })

  return result
}

const IngredientsPanel: React.FC<IngredientsPanelProps> = ({
  recipe,
  onClose,
  onUpdateIngredient,
  darkMode,
  marketplaceData: externalMarketplaceData,
}) => {
  const [ingredients, setIngredients] = useState<[string, string][]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")
  const [expandedIngredient, setExpandedIngredient] = useState<string | null>(
    null
  )
  const [cart, setCart] = useState<
    { ingredient: string; brand: string; cost: number }[]
  >([])
  const [marketplaceData, setMarketplaceData] =
    useState<IngredientMarketplaceData>({})
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    const allIngredients = new Map<string, string>()
    Object.values(recipe).forEach((step) => {
      step.measurements.forEach(([ingredient, quantity]) => {
        allIngredients.set(ingredient, quantity)
      })
    })
    setIngredients(Array.from(allIngredients.entries()))
  }, [recipe])

  useEffect(() => {
    if (externalMarketplaceData) {
      setMarketplaceData(externalMarketplaceData)
    } else {
      const data = getMarketplaceDataFromRecipe(recipe, ingredientBrandsCosts)
      setMarketplaceData(data)
    }
  }, [recipe, externalMarketplaceData])

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

  const capitalizeFirst = (str: string) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

  const handleCartToggle = (
    ingredient: string,
    option: MarketplaceOption,
    checked: boolean
  ) => {
    if (checked) {
      setCart([...cart, { ingredient, ...option }])
    } else {
      setCart(
        cart.filter(
          (item) =>
            !(item.ingredient === ingredient && item.brand === option.brand)
        )
      )
    }
  }

  const hasMarketplaceData = (ingredient: string): boolean => {
    return (
      !!marketplaceData[ingredient] && marketplaceData[ingredient].length > 0
    )
  }

  const removeFromCart = (index: number) => {
    const newCart = [...cart]
    newCart.splice(index, 1)
    setCart(newCart)
  }

  const getTotalCost = () => {
    return cart.reduce((sum, item) => sum + item.cost, 0)
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
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCart(!showCart)}
              className={`p-2 rounded-full relative transition-colors ${
                darkMode
                  ? "hover:bg-gray-700 text-white"
                  : "hover:bg-gray-200 text-gray-900"
              }`}
              aria-label="Shopping cart"
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span
                  className={`absolute -top-1 -right-1 rounded-full w-5 h-5 flex items-center justify-center text-xs ${
                    darkMode
                      ? "bg-blue-500 text-white"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {cart.length}
                </span>
              )}
            </button>
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
        </div>

        {showCart ? (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Your Shopping Cart
              </h3>
              <button
                onClick={() => setShowCart(false)}
                className={`text-sm ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              >
                Back to ingredients
              </button>
            </div>

            {cart.length === 0 ? (
              <p
                className={`italic ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Your cart is empty
              </p>
            ) : (
              <>
                <ul className="space-y-3">
                  {cart.map((item, index) => (
                    <li
                      key={index}
                      className={`p-3 border rounded-lg flex justify-between items-center ${
                        darkMode
                          ? "border-gray-700 bg-gray-700"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div>
                        <p
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {capitalizeFirst(item.ingredient)}
                        </p>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {item.brand} - ₹{item.cost.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className={`p-1 rounded-full ${
                          darkMode
                            ? "text-red-400 hover:bg-gray-600"
                            : "text-red-500 hover:bg-gray-100"
                        }`}
                        aria-label="Remove from cart"
                      >
                        <X size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
                <div
                  className={`mt-4 p-4 rounded-lg ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between mb-2">
                    <span
                      className={darkMode ? "text-gray-300" : "text-gray-700"}
                    >
                      Subtotal:
                    </span>
                    <span
                      className={`font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ₹{getTotalCost().toFixed(2)}
                    </span>
                  </div>
                  <button
                    className={`w-full py-2 px-4 rounded-lg font-medium mt-2 ${
                      darkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                    onClick={() => {
                      alert(
                        `Order placed successfully! Total: ₹${getTotalCost().toFixed(
                          2
                        )}`
                      )
                      setCart([])
                    }}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
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
                {ingredients.map(([ingredient, quantity], index) => (
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
                        {capitalizeFirst(ingredient)}
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
                            {quantity}
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

                    {/* Buy near you dropdown */}
                    <div className="mt-2">
                      <button
                        onClick={() =>
                          setExpandedIngredient(
                            expandedIngredient === ingredient
                              ? null
                              : ingredient
                          )
                        }
                        className={`text-sm mt-2 ${
                          darkMode
                            ? "text-blue-400 hover:underline"
                            : "text-blue-600 hover:underline"
                        }`}
                      >
                        Buy near you
                      </button>

                      {expandedIngredient === ingredient && (
                        <div className="mt-2 pl-2">
                          {hasMarketplaceData(ingredient) ? (
                            <div className="space-y-2">
                              {marketplaceData[ingredient].map((option, i) => {
                                const isChecked = cart.some(
                                  (item) =>
                                    item.ingredient === ingredient &&
                                    item.brand === option.brand
                                )
                                return (
                                  <label
                                    key={i}
                                    className="flex items-center space-x-2 text-sm"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) =>
                                        handleCartToggle(
                                          ingredient,
                                          option,
                                          e.target.checked
                                        )
                                      }
                                      className={`${
                                        darkMode
                                          ? "accent-blue-400"
                                          : "accent-blue-600"
                                      }`}
                                    />
                                    <span
                                      className={
                                        darkMode
                                          ? "text-gray-300"
                                          : "text-gray-700"
                                      }
                                    >
                                      {option.brand} — ₹{option.cost.toFixed(2)}
                                    </span>
                                  </label>
                                )
                              })}
                            </div>
                          ) : (
                            <p
                              className={`text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              No marketplace data available for this ingredient.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default IngredientsPanel
