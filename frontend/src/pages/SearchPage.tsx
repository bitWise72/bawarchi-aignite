import React, { useState, useEffect } from "react"
import {
  Search,
  Mic,
  Camera,
  ChefHat,
  TrendingUp,
  Moon,
  Sun,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useDarkMode } from "@/contexts/DarkModeContext"

interface SearchPageProps {
  mode: "normal" | "experimental"
  setMode: (mode: "normal" | "experimental" | null) => void
}

function SearchPage({ mode, setMode }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const { darkMode, setDarkMode } = useDarkMode()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value)

  const handleSubmit = (e: React.FormEvent) => {
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

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode ? "bg-oxford-blue-500" : "bg-anti-flash-white-500"
      }`}
    >
      {/* Mode toggle and theme toggle buttons */}
      <div className="w-full flex justify-end items-center p-4">
        {/* <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setDarkMode(!darkMode)}
          className={`p-3 rounded-full shadow-md transition-all duration-300 ${
            darkMode
              ? "bg-snow-500 text-oxford-blue-500 hover:bg-snow-400"
              : "bg-gunmetal-500 text-anti-flash-white-500 hover:bg-gunmetal-400"
          }`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button> */}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMode(null)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-300 ${
            mode === "normal"
              ? darkMode
                ? "bg-cardinal-900 text-cardinal-500 hover:bg-cardinal-800"
                : "bg-primary-light text-primary-DEFAULT hover:bg-blue-100"
              : darkMode
              ? "bg-asparagus-900 text-asparagus-500 hover:bg-asparagus-800"
              : "bg-timberwolf-500 text-gunmetal-500 hover:bg-timberwolf-400"
          }`}
        >
          {mode === "normal" ? "🔵 Normal Mode" : "🟣 Experimental Mode"}{" "}
          (Change)
        </motion.button>
      </div>

      <div className="px-4 sm:px-6 md:px-12 lg:px-20 py-10 max-w-7xl mx-auto">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className={`text-2xl sm:text-3xl md:text-5xl font-bold mb-4 ${
              darkMode ? "text-amber-500" : "text-burnt-sienna-500"
            }`}
          >
            Find Your Perfect Recipe
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className={`text-sm md:text-base ${
              darkMode ? "text-snow-500" : "text-gunmetal-600"
            }`}
          >
            Search thousands of recipes from around the world
          </motion.p>
        </motion.div>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl mx-auto mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{
              boxShadow: darkMode
                ? "0 8px 20px rgba(255, 193, 0, 0.15)"
                : "0 8px 20px rgba(215, 122, 97, 0.15)",
            }}
            transition={{ duration: 0.4 }}
            className={`flex items-center h-16 px-5 rounded-full border-2 shadow-lg focus-within:shadow-xl transition-all duration-300 ${
              isSearchFocused
                ? darkMode
                  ? "border-amber-500 shadow-amber-500/30"
                  : "border-burnt-sienna-500 shadow-burnt-sienna-500/30"
                : darkMode
                ? "border-oxford-blue-400"
                : "border-timberwolf-400"
            } ${darkMode ? "bg-gunmetal-400 " : "bg-anti-flash-white-500"}`}
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Search
                className={
                  darkMode ? "text-amber-500" : "text-burnt-sienna-500"
                }
                size={24}
              />
            </motion.div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`flex-grow pl-4 pr-2 h-full bg-transparent outline-none text-lg ${
                darkMode ? "text-snow-500" : "text-gunmetal-500"
              }`}
              placeholder="Search for recipes, ingredients, or cuisines"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className={`text-2xl hover:opacity-80 ${
                    darkMode ? "text-snow-700" : "text-gunmetal-400"
                  }`}
                >
                  ×
                </motion.button>
              )}
            </AnimatePresence>
            <div className="flex items-center space-x-4 ml-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.15, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full hover:bg-opacity-20 ${
                  darkMode
                    ? "text-snow-700 hover:bg-snow-900"
                    : "text-gunmetal-400 hover:bg-gunmetal-100"
                }`}
              >
                <Mic size={20} />
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.15, rotate: -10 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full hover:bg-opacity-20 ${
                  darkMode
                    ? "text-snow-700 hover:bg-snow-900"
                    : "text-gunmetal-400 hover:bg-gunmetal-100"
                }`}
              >
                <Camera size={20} />
              </motion.button>
            </div>
          </motion.div>
        </form>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Suggested Recipes */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`w-full md:w-1/2 rounded-2xl p-6 shadow-lg transition-all duration-300 transform ${
              darkMode
                ? "bg-oxford-blue-400 border-l-4 border-amber-500 shadow-xl shadow-oxford-blue-300/20"
                : "bg-anti-flash-white-400 border-l-4 border-burnt-sienna-500 shadow-lg shadow-gunmetal-100/20"
            }`}
          >
            <motion.div
              className="flex items-center mb-6"
              whileHover={{ x: 5 }}
            >
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
              >
                <ChefHat
                  className={
                    darkMode ? "text-amber-500" : "text-burnt-sienna-500"
                  }
                  size={26}
                />
              </motion.div>
              <h2
                className={`text-xl font-bold ml-3 ${
                  darkMode ? "text-snow-500" : "text-gunmetal-500"
                }`}
              >
                Suggested Recipes
              </h2>
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              {suggestedRecipes.map((recipe, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.4 }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: darkMode
                      ? "rgba(255, 193, 0, 0.9)"
                      : "rgba(215, 122, 97, 0.9)",
                    color: darkMode ? "#000022" : "#ffffff",
                    boxShadow: darkMode
                      ? "0 10px 15px -3px rgba(255, 193, 0, 0.2), 0 4px 6px -4px rgba(255, 193, 0, 0.2)"
                      : "0 10px 15px -3px rgba(215, 122, 97, 0.2), 0 4px 6px -4px rgba(215, 122, 97, 0.2)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-xl cursor-pointer text-sm transition-all duration-300 ease-in-out shadow-md flex items-center justify-center text-center h-16 ${
                    darkMode
                      ? "bg-gunmetal-400  text-snow-500 shadow-oxford-blue-200/30"
                      : "bg-white text-gunmetal-500 shadow-gunmetal-100/20"
                  }`}
                >
                  {recipe}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Trending Tags */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`w-full md:w-1/2 rounded-2xl p-6 shadow-lg transition-all duration-300 transform ${
              darkMode
                ? "bg-oxford-blue-400 border-r-4 border-amber-500 shadow-xl shadow-oxford-blue-300/20"
                : "bg-anti-flash-white-400 border-r-4 border-burnt-sienna-500 shadow-lg shadow-gunmetal-100/20"
            }`}
          >
            <motion.div
              className="flex items-center mb-6"
              whileHover={{ x: 5 }}
            >
              <motion.div
                animate={{
                  y: [0, -5, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                <TrendingUp
                  className={
                    darkMode ? "text-amber-500" : "text-burnt-sienna-500"
                  }
                  size={26}
                />
              </motion.div>
              <h2
                className={`text-xl font-bold ml-3 ${
                  darkMode ? "text-snow-500" : "text-gunmetal-500"
                }`}
              >
                Trending
              </h2>
            </motion.div>
            <div className="flex flex-wrap gap-3">
              {trendingTags.map((tag, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * i, duration: 0.4 }}
                  whileHover={{
                    scale: 1.08,
                    backgroundColor: darkMode
                      ? "rgba(255, 193, 0, 0.9)"
                      : "rgba(215, 122, 97, 0.9)",
                    color: darkMode ? "#000022" : "#ffffff",
                    boxShadow: darkMode
                      ? "0 4px 12px rgba(255, 193, 0, 0.25)"
                      : "0 4px 12px rgba(215, 122, 97, 0.25)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 ease-in-out shadow-md ${
                    darkMode
                      ? "bg-gunmetal-400  text-snow-500 shadow-oxford-blue-200/30"
                      : "bg-white text-gunmetal-500 shadow-gunmetal-100/20"
                  }`}
                >
                  #{tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Food Animation */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotateZ: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
            className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 0.9, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-full h-full rounded-full"
              style={{
                background: `radial-gradient(circle, ${
                  darkMode
                    ? "rgba(255, 193, 0, 0.3)"
                    : "rgba(215, 122, 97, 0.3)"
                } 30%, transparent 70%)`,
              }}
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl md:text-6xl">
              {mounted && (
                <motion.div
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: 360 }}
                  transition={{
                    duration: 2,
                    delay: 1,
                    repeat: Infinity,
                    repeatDelay: 5,
                  }}
                >
                  🍽️
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Footer animation */}
        <motion.div
          className="mt-16 text-center opacity-70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1 }}
        >
          <motion.p
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className={darkMode ? "text-snow-700" : "text-gunmetal-400"}
          >
            Discover delicious recipes today
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

export default SearchPage
