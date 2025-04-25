import React, { useState } from "react"
import Navbar from "@/components/Navbar"
import { Search, Mic, Camera, ChefHat, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { useDarkMode } from "@/contexts/DarkModeContext";


function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { darkMode, setDarkMode } = useDarkMode();
  const handleSearchChange = (e) => setSearchQuery(e.target.value)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Search query:", searchQuery)
  }

  const suggestedRecipes = [
    "Butter Chicken",
    "Vegetable Biryani",
    "Masala Dosa",
    "Palak Paneer",
    "Chicken Tikka",
    "Chole Bhature",
    "Tandoori Roti",
    "Gulab Jamun",
  ]

  const trendingTags = [
    "Quick Dinner",
    "Vegan",
    "Gluten Free",
    "Street Food",
    "Desserts",
    "Instant Pot",
    "Keto",
  ]

  const user = JSON.parse(localStorage.getItem("user") || "{}")

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{ backgroundColor: darkMode ? "#000000" : "#FFFFFF" }}
    >
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        name={user?.name || ""}
        image={user?.image || ""}
      />

      <div className="px-4 sm:px-6 md:px-12 lg:px-20 py-10 max-w-7xl mx-auto">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2"
            style={{ color: darkMode ? "#FFC700" : "#FF6E00" }}
          >
            Find Your Perfect Recipe
          </h1>
          <p
            className="text-sm md:text-base"
            style={{ color: darkMode ? "#D1D5DB" : "#4B5563" }}
          >
            Search thousands of recipes from around the world
          </p>
        </motion.div>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl mx-auto mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center h-14 px-4 rounded-full border-2 shadow-lg focus-within:shadow-xl"
            style={{
              backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
              borderColor: darkMode ? "#374151" : "#E5E7EB",
              boxShadow: darkMode
                ? "0 4px 12px rgba(255, 199, 0, 0.1)"
                : "0 4px 12px rgba(255, 110, 0, 0.1)",
            }}
          >
            <Search
              style={{ color: darkMode ? "#FFC700" : "#FF6E00" }}
              size={22}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="flex-grow pl-3 pr-2 h-full bg-transparent outline-none"
              style={{
                color: darkMode ? "#FFFFFF" : "#000000",
                caretColor: darkMode ? "#FFC700" : "#FF6E00",
              }}
              placeholder="Search for recipes, ingredients, or cuisines"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{ color: darkMode ? "#9CA3AF" : "#6B7280" }}
                className="hover:opacity-80"
              >
                ×
              </button>
            )}
            <div className="flex items-center space-x-3 ml-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{ color: darkMode ? "#9CA3AF" : "#6B7280" }}
                className="p-1 hover:opacity-80"
              >
                <Mic size={20} />
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{ color: darkMode ? "#9CA3AF" : "#6B7280" }}
                className="p-1 hover:opacity-80"
              >
                <Camera size={20} />
              </motion.button>
            </div>
          </motion.div>
        </form>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Suggested Recipes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full md:w-1/2 rounded-2xl p-6 shadow-lg"
            style={{
              backgroundColor: darkMode ? "#1F2937" : "#F9FAFB",
              boxShadow: darkMode
                ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                : "0 4px 12px rgba(0, 0, 0, 0.05)",
              borderLeft: `4px solid ${darkMode ? "#FFC700" : "#FF6E00"}`,
            }}
          >
            <div className="flex items-center mb-6">
              <ChefHat
                style={{ color: darkMode ? "#FFC700" : "#FF6E00" }}
                size={24}
              />
              <h2
                className="text-xl font-bold ml-2"
                style={{ color: darkMode ? "#FFFFFF" : "#000000" }}
              >
                Suggested Recipes
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              {suggestedRecipes.map((recipe, i) => (
                <motion.div
                  key={i}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: darkMode ? "#FFC700" : "#FF6E00", // On hover, change background
                    color: darkMode ? "#000000" : "#FFFFFF", // On hover, change text color
                  }}
                  whileTap={{ scale: 0.95 }} // Add tap effect
                  className="p-4 rounded-xl cursor-pointer text-sm transition-all duration-300 ease-in-out shadow-md flex items-center justify-center text-center h-16"
                  style={{
                    backgroundColor: darkMode ? "#374151" : "#FFFFFF",
                    color: darkMode ? "#FFFFFF" : "#000000",
                  }}
                >
                  {recipe}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Trending Tags */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full md:w-1/2 rounded-2xl p-6 shadow-lg"
            style={{
              backgroundColor: darkMode ? "#1F2937" : "#F9FAFB",
              boxShadow: darkMode
                ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                : "0 4px 12px rgba(0, 0, 0, 0.05)",
              borderRight: `4px solid ${darkMode ? "#FFC700" : "#FF6E00"}`,
            }}
          >
            <div className="flex items-center mb-6">
              <TrendingUp
                style={{ color: darkMode ? "#FFC700" : "#FF6E00" }}
                size={24}
              />
              <h2
                className="text-xl font-bold ml-2"
                style={{ color: darkMode ? "#FFFFFF" : "#000000" }}
              >
                Trending
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {trendingTags.map((tag, i) => (
                <motion.span
                  key={i}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: darkMode ? "#FFC700" : "#FF6E00",
                    color: darkMode ? "#000000" : "#FFFFFF",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 ease-in-out shadow-md"
                  style={{
                    backgroundColor: darkMode ? "#374151" : "#FFFFFF",
                    color: darkMode ? "#FFFFFF" : "#000000",
                  }}
                >
                  #{tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Food Animation (Optional) */}
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center"
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `radial-gradient(circle, ${
                  darkMode ? "#FFC700" : "#FF6E00"
                }22, transparent 70%)`,
              }}
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl md:text-5xl">
              🍽️
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default SearchPage
