import { useState } from "react"
import { motion } from "framer-motion"

function ChoicePage() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div
      className={`h-screen w-screen flex transition-colors duration-500 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Left Side Content */}
      <div className="w-1/2 p-10 flex flex-col justify-between">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
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
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-800 text-white px-3 py-1 rounded shadow-md text-sm hover:bg-gray-700"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </motion.div>

        {/* Main Content - Centered */}
        <motion.div
          className="flex-grow flex flex-col justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold mb-4">Bawarchi.AI</h1>
          <h2 className="text-3xl font-semibold mb-4">Your Food Companion</h2>
          <p className="text-lg mb-8">Please select an option below:</p>
          <div className="flex space-x-4">
            <motion.button
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:scale-105 transition-transform"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Option 1
            </motion.button>
            <motion.button
              className="bg-green-500 text-white px-4 py-2 rounded shadow hover:scale-105 transition-transform"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Option 2
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
          className="relative z-10 w-2/3 max-w-[375px]"
          initial={{ opacity: 0, y: 30 }}
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