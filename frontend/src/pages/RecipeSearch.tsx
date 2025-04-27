import React, { useState } from "react"
import { motion } from "framer-motion"
import SearchStructurePage from "@/pages/SearchStructurePage"
import SearchPage from "@/pages/SearchPage"
import { useDarkMode } from "@/contexts/DarkModeContext"
import Navbar from "@/components/Navbar"

const RecipeSearch: React.FC = () => {
  const [mode, setMode] = useState<"normal" | "experimental" | null>(null)
  const { darkMode, setDarkMode } = useDarkMode()
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const handleChangeMode = () => {
    setMode(null)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        name={user?.name || ""}
        image={user?.image || ""}
      />
      <div
        className={`min-h-screen flex flex-col items-center pt-4 px-4 sm:px-6 relative transition-colors duration-300 ${
          darkMode ? "bg-oxford-blue-500" : "bg-anti-flash-white-500"
        }`}
      >
        {!mode && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full max-w-4xl"
          >
            <motion.h1
              variants={itemVariants}
              className={`text-3xl sm:text-4xl font-bold mb-8 sm:mb-10 text-center transition-colors duration-300 ${
                darkMode ? "text-snow-500" : "text-gunmetal-500"
              }`}
            >
              Choose a Mode
            </motion.h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 w-full">
              {/* Normal Mode Tile */}
              <motion.div
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  boxShadow: darkMode
                    ? "0 10px 25px rgba(255, 125, 0, 0.2)"
                    : "0 10px 25px rgba(215, 122, 97, 0.2)",
                  backgroundColor: darkMode ? "#111144" : "#f8f6f7",
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setMode("normal")}
                className={`cursor-pointer rounded-2xl p-6 sm:p-8 transition-all duration-300 border-l-4 ${
                  darkMode
                    ? "bg-oxford-blue-400 text-snow-500 border-orange-wheel-500 shadow-lg"
                    : "bg-anti-flash-white-600 text-gunmetal-500 border-burnt-sienna-500 shadow-md"
                }`}
              >
                <h2
                  className={`text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 ${
                    darkMode ? "text-orange-wheel-500" : "text-burnt-sienna-500"
                  }`}
                >
                  Normal
                </h2>
                <p
                  className={`mb-3 sm:mb-4 text-sm sm:text-base ${
                    darkMode ? "text-snow-400" : "text-gunmetal-600"
                  }`}
                >
                  Provide recipe name, description, steps and image.
                </p>
                <ul
                  className={`list-disc list-inside text-sm sm:text-base ${
                    darkMode ? "text-asparagus-500" : "text-gunmetal-700"
                  }`}
                >
                  <li>Structured recipe creation</li>
                  <li>Recipe history information</li>
                  <li>Nutrition breakdown</li>
                </ul>
              </motion.div>

              {/* Experimental Mode Tile */}
              <motion.div
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  boxShadow: darkMode
                    ? "0 10px 25px rgba(196, 40, 71, 0.2)"
                    : "0 10px 25px rgba(255, 193, 0, 0.2)",
                  backgroundColor: darkMode ? "#111144" : "#f8f6f7",
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setMode("experimental")}
                className={`cursor-pointer rounded-2xl p-6 sm:p-8 transition-all duration-300 border-r-4 ${
                  darkMode
                    ? "bg-oxford-blue-400 text-snow-500 border-cardinal-500 shadow-lg"
                    : "bg-anti-flash-white-600 text-gunmetal-500 border-amber-500 shadow-md"
                }`}
              >
                <h2
                  className={`text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 ${
                    darkMode ? "text-cardinal-500" : "text-amber-500"
                  }`}
                >
                  Experimental
                </h2>
                <p
                  className={`mb-3 sm:mb-4 text-sm sm:text-base ${
                    darkMode ? "text-snow-400" : "text-gunmetal-600"
                  }`}
                >
                  Just provide a food name.
                </p>
                <ul
                  className={`list-disc list-inside text-sm sm:text-base ${
                    darkMode ? "text-asparagus-500" : "text-gunmetal-700"
                  }`}
                >
                  <li>Quick recipe generation</li>
                  <li>Auto-fill recipe details</li>
                  <li>Includes history and nutrition</li>
                </ul>
              </motion.div>
            </div>

            <motion.div
              variants={itemVariants}
              className="mt-12 flex justify-center"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="text-5xl"
              >
                🍳
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Conditionally render pages */}
        {mode === "normal" && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="w-full"
  >
    <SearchStructurePage mode={mode} setMode={setMode} darkMode={darkMode} />
  </motion.div>
)}
{mode === "experimental" && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="w-full"
  >
    <SearchPage mode={mode} setMode={setMode} darkMode={darkMode} />
  </motion.div>
)}

      </div>
    </>
  )
}

export default RecipeSearch
