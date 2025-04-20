import React, { useState, useEffect } from "react"
import {
  X,
  Edit,
  Check,
  ShoppingCart,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle,
} from "lucide-react"
import stringSimilarity from "string-similarity"
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
  marketplaceData: IngredientMarketplaceData // passed in as your ingredient_data JSON
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
  const keys = Object.keys(data)
  // Build array of normalized keys
  const normalizedKeys = keys.map((k) => normalize(k))

  const { bestMatch } = stringSimilarity.findBestMatch(
    normalizedInput,
    normalizedKeys
  )

  // threshold can be tuned
  if (bestMatch.rating > 0.6) {
    const matchIndex = normalizedKeys.indexOf(bestMatch.target)
    return keys[matchIndex]
  }
  return null
}

function getMarketplaceDataFromRecipe(
  recipe: Recipe,
  ingredientData: IngredientMarketplaceData
): IngredientMarketplaceData {
  const result: IngredientMarketplaceData = {}
  const used = new Set<string>()

  // recipe is an object of steps; collect all ingredients
  Object.values(recipe).forEach((step) => {
    step.measurements.forEach(([ingredient]) => {
      const norm = normalize(ingredient)
      if (used.has(norm)) return

      const matchKey = findMatchingIngredientKey(ingredient, ingredientData)
      if (matchKey) {
        result[ingredient] = ingredientData[matchKey]
        used.add(norm)
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
  marketplaceData: rawMarketplaceData,
}) => {
  const [ingredients, setIngredients] = useState<[string, string][]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")
  const [expandedIngredient, setExpandedIngredient] = useState<string | null>(
    null
  )

  const [marketplaceData, setMarketplaceData] =
    useState<IngredientMarketplaceData>({})
  const [showCart, setShowCart] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  // Populate ingredients list from recipe
  useEffect(() => {
    const map = new Map<string, string>()
    Object.values(recipe).forEach((step) =>
      step.measurements.forEach(([ing, qty]) => map.set(ing, qty))
    )
    setIngredients(Array.from(map.entries()))
  }, [recipe])

  // Match recipe ingredients to rawMarketplaceData keys via string-similarity
  useEffect(() => {
    const matched = getMarketplaceDataFromRecipe(recipe, rawMarketplaceData)
    setMarketplaceData(matched)
  }, [recipe, rawMarketplaceData])

  // Handlers, formatting
  const handleEdit = (i: number) => {
    setEditingIndex(i)
    setEditValue(ingredients[i][1])
  }
  const handleSave = (i: number) => {
    const [ing] = ingredients[i]
    const updated = [...ingredients]
    updated[i] = [ing, editValue]
    setIngredients(updated)
    onUpdateIngredient(ing, editValue)
    setEditingIndex(null)
    setEditValue("")
  }
  const capitalizeFirst = (s: string) =>
    s
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")

  const [cart, setCart] = useState<
    { ingredient: string; brand: string; cost: number; quantity: number }[]
  >([])

  const handleCartToggle = (
    ingredient: string,
    option: MarketplaceOption,
    checked: boolean
  ) => {
    if (checked) {
      setCart([...cart, { ingredient, ...option, quantity: 1 }])
    } else {
      setCart((c) =>
        c.filter(
          (item) =>
            !(item.ingredient === ingredient && item.brand === option.brand)
        )
      )
    }
  }
  const incrementQty = (i: number) => {
    setCart((c) =>
      c.map((item, idx) =>
        idx === i ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const decrementQty = (i: number) => {
    setCart((c) =>
      c
        .map((item, idx) =>
          idx === i ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (idx: number) => {
    setCart((c) => c.filter((_, i) => i !== idx))
  }

  const getTotalCost = () =>
    cart.reduce((sum, i) => sum + i.cost * i.quantity, 0)

  const hasMarketplaceData = (ing: string) => !!marketplaceData[ing]?.length

  const handleCheckout = () => {
    setIsLoading(true)

    // Simulate API call with timeout
    setTimeout(() => {
      setIsLoading(false)
      setOrderPlaced(true)

      // Reset after showing success message for a few seconds
      setTimeout(() => {
        setOrderPlaced(false)
        setCart([])
        setShowCart(false)
      }, 3000)
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex justify-end transition-opacity duration-300">
      <div
        className={`w-full max-w-md h-full overflow-y-auto shadow-2xl transform transition-transform duration-300 ${
          darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
        }`}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 flex flex-col items-center max-w-sm mx-auto">
              <Loader2 size={60} className="text-blue-500 animate-spin mb-6" />
              <p
                className={`text-xl font-semibold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Processing your order...
              </p>
              <p
                className={`text-center mt-2 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Please wait while we confirm your items.
              </p>
            </div>
          </div>
        )}

        {/* Success Message Overlay */}
        {orderPlaced && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 flex flex-col items-center max-w-sm mx-auto">
              <div className="mb-4 text-green-500">
                <CheckCircle size={80} />
              </div>
              <h3
                className={`text-2xl font-bold mb-2 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Order Placed!
              </h3>
              <p
                className={`text-center ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Your ingredients will be delivered shortly. Thank you for your
                order!
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div
          className={`p-5 border-b sticky top-0 flex justify-between items-center shadow-sm z-10 ${
            darkMode
              ? "bg-gray-900 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Precise Ingredients
          </h2>
          <div className="flex items-center space-x-5">
            <button
              onClick={() => setShowCart(!showCart)}
              className={`relative flex items-center transition-colors duration-200 ${
                darkMode ? "hover:text-blue-400" : "hover:text-blue-600"
              }`}
            >
              <ShoppingCart
                className={`${darkMode ? "text-gray-200" : "text-gray-800"} ${
                  showCart ? (darkMode ? "text-blue-400" : "text-blue-600") : ""
                }`}
                size={24}
              />
              {cart.length > 0 && (
                <span
                  className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold`}
                >
                  {cart.length}
                </span>
              )}
            </button>
            <button
              onClick={onClose}
              className={`p-1 rounded-full transition-colors duration-200 ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <X
                className={darkMode ? "text-gray-200" : "text-gray-800"}
                size={24}
              />
            </button>
          </div>
        </div>

        {/* Cart View */}
        {showCart ? (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <h3
                className={`text-xl font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Your Cart
              </h3>
              {cart.length === 0 ? (
                <div
                  className={`py-8 flex flex-col items-center justify-center ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <ShoppingCart size={48} className="mb-3 opacity-50" />
                  <p className="text-center">
                    Your cart is empty. <br />
                    Add ingredients to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-4 rounded-xl border ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      } shadow-sm transition-all duration-200`}
                    >
                      <div className="flex-1">
                        <p
                          className={`font-semibold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {capitalizeFirst(item.ingredient)}
                        </p>
                        <span
                          className={
                            darkMode ? "text-gray-300" : "text-gray-600"
                          }
                        >
                          {item.brand}
                        </span>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <span
                          className={`font-semibold ${
                            darkMode ? "text-green-400" : "text-green-600"
                          }`}
                        >
                          ₹{(item.cost * item.quantity).toFixed(2)}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => decrementQty(i)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              darkMode
                                ? "bg-gray-700 hover:bg-gray-600 text-white"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                            } transition-colors duration-200`}
                          >
                            <Minus size={16} />
                          </button>
                          <span
                            className={`font-medium w-6 text-center ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => incrementQty(i)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              darkMode
                                ? "bg-gray-700 hover:bg-gray-600 text-white"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                            } transition-colors duration-200`}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(i)}
                        className={`ml-4 p-2 rounded-full ${
                          darkMode
                            ? "hover:bg-red-900/30 text-red-400"
                            : "hover:bg-red-100 text-red-500"
                        } transition-colors duration-200`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div
                className={`border-t p-5 sticky bottom-0 shadow-lg ${
                  darkMode
                    ? "bg-gray-900 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <p
                    className={`text-lg ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Total:
                  </p>
                  <p
                    className={`text-xl font-bold ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    ₹{getTotalCost().toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Ingredients List View */
          <div className="p-5 space-y-4">
            {ingredients.map(([ing, qty], idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  darkMode
                    ? "border-gray-700 bg-gray-800/50"
                    : "border-gray-200 bg-gray-50/50"
                } transition-all duration-200`}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {capitalizeFirst(ing)}
                  </span>
                  {editingIndex === idx ? (
                    <div className="flex items-center space-x-2">
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className={`w-16 p-1 border rounded focus:outline-none focus:ring-2 ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500/50"
                            : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500/30"
                        }`}
                      />
                      <button
                        onClick={() => handleSave(idx)}
                        className={`p-1 rounded-full ${
                          darkMode
                            ? "hover:bg-gray-700 text-green-400"
                            : "hover:bg-gray-200 text-green-600"
                        } transition-colors duration-200`}
                      >
                        <Check size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-2 py-1 rounded ${
                          darkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {qty}
                      </span>
                      <button
                        onClick={() => handleEdit(idx)}
                        className={`p-1 rounded-full ${
                          darkMode
                            ? "hover:bg-gray-700 text-gray-400"
                            : "hover:bg-gray-200 text-gray-600"
                        } transition-colors duration-200`}
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Buy Near You Dropdown */}
                {hasMarketplaceData(ing) && (
                  <div className="mt-3 space-y-2">
                    <button
                      onClick={() =>
                        setExpandedIngredient(
                          expandedIngredient === ing ? null : ing
                        )
                      }
                      className={`flex items-center px-3 py-2 rounded-lg w-full ${
                        darkMode
                          ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      } transition-colors duration-200`}
                    >
                      <span className="flex-1 text-left font-medium">
                        Buy Near You
                      </span>
                      {expandedIngredient === ing ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>

                    {expandedIngredient === ing && (
                      <div className="pt-3 space-y-2 pl-2">
                        {marketplaceData[ing].map((opt, i) => {
                          const isChecked = cart.some(
                            (c) => c.ingredient === ing && c.brand === opt.brand
                          )
                          return (
                            <div
                              key={i}
                              className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ${
                                isChecked
                                  ? darkMode
                                    ? "bg-blue-900/30 border-blue-500"
                                    : "bg-blue-50 border-blue-300"
                                  : darkMode
                                  ? "bg-gray-700 border-gray-600 hover:border-blue-500/50"
                                  : "bg-white border-gray-300 hover:border-blue-300"
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) =>
                                    handleCartToggle(ing, opt, e.target.checked)
                                  }
                                  className={`w-5 h-5 rounded ${
                                    darkMode
                                      ? "bg-gray-700 border-gray-500 text-blue-500"
                                      : "bg-gray-100 border-gray-300 text-blue-600"
                                  }`}
                                />
                                <div>
                                  <p
                                    className={`font-semibold ${
                                      darkMode ? "text-white" : "text-gray-900"
                                    }`}
                                  >
                                    {opt.brand}
                                  </p>
                                  <p
                                    className={`text-sm font-medium ${
                                      darkMode
                                        ? "text-green-400"
                                        : "text-green-600"
                                    }`}
                                  >
                                    ₹{opt.cost.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default IngredientsPanel
