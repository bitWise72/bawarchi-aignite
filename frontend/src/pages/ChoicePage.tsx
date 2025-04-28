import { useState } from "react"
import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { useDarkMode } from "@/contexts/DarkModeContext"


function ChoicePage() {
    const { darkMode, setDarkMode } = useDarkMode();

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 px-4 sm:px-6 md:px-12 lg:px-20 ${
        darkMode ? "bg-black" : "bg-white"
      }`}
    >
      {/* Dark Mode Toggle */}
      <motion.button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-3 right-3 p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </motion.button>

      {/* Layout */}
      <div className="flex flex-col md:flex-row w-full min-h-screen">
        {/* Left Content */}
        <div className="w-full p-4 sm:p-6 md:p-10 flex flex-col justify-between md:w-1/2">
          {/* Logo */}
          <motion.div
            className="flex items-center absolute top-3 left-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.img
              src="./logo.png"
              alt="logo"
              className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10"
              initial={{ rotate: -20 }}
              animate={{ rotate: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            />
            <h3
              style={{ color: darkMode ? "#FFFFFF" : "#000000" }}
              className="text-base sm:text-lg md:text-xl font-bold ml-2"
            >
              Bawarchi.AI
            </h3>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="flex-grow flex flex-col justify-center pt-20 md:pt-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1
              style={{ color: darkMode ? "#FFC700" : "#FF6E00" }}
              className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2"
            >
              Bawarchi.AI
            </h1>
            <h2
              style={{ color: darkMode ? "#FFFFFF" : "#000000" }}
              className="text-lg sm:text-xl md:text-3xl font-semibold mb-2"
            >
              Your Food Companion
            </h2>
            {/* <p
              style={{ color: darkMode ? "#D1D5DB" : "#4B5563" }}
              className="text-sm sm:text-base md:text-lg mb-6"
            >
              Please select an option below:
            </p> */}
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
              <motion.button
                onClick={() => (window.location.href = "/recipe-search")}
                // style={{
                //   backgroundColor: "#FFC700",
                //   color: "#000000",
                // }}
                style={{
                  backgroundColor: "#FF6E00",
                  color: "#FFFFFF",
                }}
                className="px-4 py-2 rounded text-sm sm:text-base shadow transition-transform font-semibold hover:bg-[#e6b600]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Cooking Journey
              </motion.button>
              {/* 
              <motion.button
                style={{
                  backgroundColor: "#FF6E00",
                  color: "#FFFFFF",
                }}
                className="px-4 py-2 rounded text-sm sm:text-base shadow transition-transform font-semibold hover:bg-[#e65f00]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Post your Recipe
              </motion.button> */}
            </div>
          </motion.div>
        </div>

        {/* Right Images */}
        <div className="relative w-full md:w-1/2 h-72 sm:h-80 md:h-auto flex items-center justify-center overflow-hidden mt-6 md:mt-0">
          <motion.img
            src={
              darkMode
                ? "./animation/dark-back.png"
                : "./animation/light-back.png"
            }
            alt="background shape"
            className="absolute w-4/5 h-4/5 object-contain max-w-[700px]"
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.img
            src={
              darkMode
                ? "./animation/dark-front.png"
                : "./animation/light-front.png"
            }
            alt="foreground shape"
            className="absolute w-3/5 h-3/5 object-contain max-w-[800px]"
            animate={{ rotate: -360 }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.img
            src="./animation/burger.png"
            alt="burger"
            className="relative z-10 w-2/3 max-w-[240px] sm:max-w-[300px] md:max-w-[500px]"
            initial={{ y: 30 }}
            animate={{
              opacity: 1,
              y: [0, -5, 0],
            }}
            transition={{
              duration: 1,
              ease: "easeOut",
              delay: 0.2,
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ChoicePage
