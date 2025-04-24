import { useState } from "react"
import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"

function ChoicePage() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div
      className={`h-screen px-32 w-screen flex transition-colors duration-500 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Dark Mode Toggle Button */}
      <motion.button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </motion.button>

      {/* Left Side Content */}
      <div className="w-1/2 p-10 flex flex-col justify-between">
        {/* Header */}
        <motion.div
          className="flex items-center absolute top-4 left-4 justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center">
            <motion.img
              src="./logo.png"
              alt="logo"
              className="h-10 w-10"
              initial={{ rotate: -20 }}
              animate={{ rotate: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            />
            <h3 className="text-xl font-bold ml-2">Bawarchi.AI</h3>
          </div>
        </motion.div>

        {/* Main Content - Centered */}
        <motion.div
          className="flex-grow flex flex-col justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1
            className={`text-5xl font-bold mb-4 ${
              darkMode ? "text-[#FFC700]" : "text-[#FF6E00]"
            }`}
          >
            Bawarchi.AI
          </h1>
          <h2 className="text-3xl font-semibold mb-4">Your Food Companion</h2>
          <p className="text-lg mb-8">Please select an option below:</p>
          <div className="flex space-x-4">
            <motion.button
              className={`px-4 py-2 rounded shadow transition-transform font-semibold ${
                darkMode
                  ? "bg-[#FFC700] text-black hover:bg-[#e6b600]"
                  : "bg-[#FFC700] text-black hover:bg-[#e6b600]"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Search a Recipe
            </motion.button>

            <motion.button
              className={`px-4 py-2 rounded shadow transition-transform font-semibold ${
                darkMode
                  ? "bg-[#FF6E00] text-white hover:bg-[#e65f00]"
                  : "bg-[#FF6E00] text-white hover:bg-[#e65f00]"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Post your Recipe
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Right Side with Animated Images */}
      <div className="relative w-1/2 flex items-center justify-center overflow-hidden">
        <motion.img
          src={
            darkMode
              ? "./animation/dark-back.png"
              : "./animation/light-back.png"
          }
          alt="background shape"
          className="absolute w-4/5 h-4/5 object-contain max-w-[900px]"
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
          className="absolute w-3/5 h-3/5 object-contain max-w-[1000px]"
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
          className="relative z-10 w-2/3 max-w-[500px]"
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
  )
}

export default ChoicePage
