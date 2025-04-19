import React, { useState, useEffect } from "react"
import { X, Edit, Check, ShoppingCart } from "lucide-react"
import stringSimilarity from "string-similarity"
import type { Recipe } from "@/services/recipeService"

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
  const getTotalCost = () => cart.reduce((sum, i) => sum + i.cost * i.quantity, 0)

  const hasMarketplaceData = (ing: string) => !!marketplaceData[ing]?.length

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div
        className={`w-full max-w-md h-full overflow-y-auto shadow-xl ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b sticky top-0 flex justify-between items-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h2 className={darkMode ? "text-white" : "text-gray-900"}>
            Precise Ingredients
          </h2>
          <div className="flex items-center space-x-3">
            <button onClick={() => setShowCart(!showCart)}>
              <ShoppingCart
                className={darkMode ? "text-white" : "text-gray-900"}
              />
              {cart.length > 0 && (
                <span className="ml-1 text-sm font-semibold">
                  {cart.length}
                </span>
              )}
            </button>
            <button onClick={onClose}>
              <X className={darkMode ? "text-white" : "text-gray-900"} />
            </button>
          </div>
        </div>

        {/* Cart View */}
        {showCart ? (
          <div className="p-4">
            <h3 className={darkMode ? "text-white" : "text-gray-900"}>
              Your Cart
            </h3>
            {cart.length === 0 ? (
              <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                Empty
              </p>
            ) : (
              <>
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <h3
                      className={`text-xl font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Your Cart
                    </h3>
                    {cart.length === 0 ? (
                      <p
                        className={darkMode ? "text-gray-400" : "text-gray-500"}
                      >
                        Your cart is empty.
                      </p>
                    ) : (
                      cart.map((item, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between p-3 rounded-xl border shadow-sm ${
                            darkMode
                              ? "bg-gray-700 border-gray-600"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <div>
                            <p
                              className={`font-semibold ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {capitalizeFirst(item.ingredient)}
                            </p>
                            <div className="flex flex-col items-end">
                              <span
                                className={
                                  darkMode ? "text-gray-300" : "text-gray-700"
                                }
                              >
                                {item.brand}
                              </span>
                              <span
                                className={
                                  darkMode ? "text-white" : "text-gray-900"
                                }
                              >
                                ₹{(item.cost * item.quantity).toFixed(2)}
                              </span>
                              <div className="flex items-center space-x-2 mt-1">
                                <button
                                  onClick={() => decrementQty(i)}
                                  className="px-2 py-1 rounded bg-gray-500 text-white"
                                >
                                  –
                                </button>
                                <span
                                  className={
                                    darkMode ? "text-white" : "text-gray-900"
                                  }
                                >
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => incrementQty(i)}
                                  className="px-2 py-1 rounded bg-gray-500 text-white"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                          <button onClick={() => removeFromCart(i)}>
                            <X
                              className={
                                darkMode ? "text-red-400" : "text-red-500"
                              }
                            />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  {cart.length > 0 && (
                    <div
                      className={`border-t p-4 sticky bottom-0 ${
                        darkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <p
                          className={`text-lg ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Total:
                        </p>
                        <p
                          className={`text-lg font-bold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          ₹{getTotalCost().toFixed(2)}
                        </p>
                      </div>
                      <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition">
                        Proceed to Checkout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          /* Ingredients List View */
          <div className="p-4 space-y-4">
            {ingredients.map(([ing, qty], idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className={darkMode ? "text-white" : "text-gray-900"}>
                    {capitalizeFirst(ing)}
                  </span>
                  {editingIndex === idx ? (
                    <div className="flex items-center space-x-1">
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-16 p-1 border rounded"
                      />
                      <button onClick={() => handleSave(idx)}>
                        <Check className="text-green-500" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
                      >
                        {qty}
                      </span>
                      <button onClick={() => handleEdit(idx)}>
                        <Edit
                          className={
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }
                        />
                      </button>
                    </div>
                  )}
                </div>

                {/* Buy Near You Dropdown */}
                {hasMarketplaceData(ing) && (
                  <div className="pl-2 space-y-1">
                    <button
                      onClick={() =>
                        setExpandedIngredient(
                          expandedIngredient === ing ? null : ing
                        )
                      }
                      className={darkMode ? "text-blue-400" : "text-blue-600"}
                    >
                      Buy Near You
                    </button>
                    {expandedIngredient === ing && (
                      <div className="pt-2 space-y-2">
                        {marketplaceData[ing].map((opt, i) => {
                          const isChecked = cart.some(
                            (c) => c.ingredient === ing && c.brand === opt.brand
                          )
                          return (
                            <div
                              key={i}
                              className={`flex items-center justify-between px-3 py-2 rounded-xl border transition ${
                                darkMode
                                  ? `bg-gray-700 border-gray-600 hover:border-blue-400`
                                  : `bg-gray-100 border-gray-300 hover:border-blue-600`
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) =>
                                    handleCartToggle(ing, opt, e.target.checked)
                                  }
                                  className="w-5 h-5"
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
                                    className={`text-sm ${
                                      darkMode
                                        ? "text-blue-300"
                                        : "text-blue-700"
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
