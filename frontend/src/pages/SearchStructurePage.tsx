import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDarkMode } from "@/contexts/DarkModeContext"
import { PlusCircle, X, Image as ImageIcon } from "lucide-react"

interface SearchStructurePageProps {
  mode: "normal" | "experimental"
  setMode: (mode: "normal" | "experimental" | null) => void
}

const SearchStructurePage: React.FC<SearchStructurePageProps> = ({
  mode,
  setMode,
}) => {
  const { darkMode, setDarkMode } = useDarkMode()
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const [recipeName, setRecipeName] = useState("")
  const [recipeDescription, setRecipeDescription] = useState("")
  const [steps, setSteps] = useState<string[]>([""])
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps]
    newSteps[index] = value
    setSteps(newSteps)
  }

  const addStep = () => {
    setSteps([...steps, ""])
  }

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      const newSteps = [...steps]
      newSteps.splice(index, 1)
      setSteps(newSteps)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
  }

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <>
      <div className="w-full flex justify-end mb-4 px-4">
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

      <motion.div
        initial="hidden"
        animate="visible"
        variants={formVariants}
        className={`max-w-3xl mx-auto p-6 rounded-2xl shadow-lg mt-6 transition-all duration-300 ${
          darkMode
            ? "bg-oxford-blue-400 text-snow-500 shadow-lg shadow-oxford-blue-300"
            : "bg-white text-gunmetal-500 shadow-md"
        }`}
      >
        <motion.h1
          variants={itemVariants}
          className={`text-3xl font-bold mb-6 text-center ${
            darkMode ? "text-snow-500" : "text-gunmetal-500"
          }`}
        >
          Create a Recipe
        </motion.h1>

        {/* Recipe Name */}
        <motion.div variants={itemVariants} className="mb-6">
          <label
            className={`block text-lg font-semibold mb-2 ${
              darkMode ? "text-asparagus-500" : "text-gunmetal-600"
            }`}
          >
            Recipe Name
          </label>
          <input
            type="text"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300 ${
              darkMode
                ? "bg-gunmetal-400 border border-oxford-blue-200 text-snow-500 focus:ring-orange-wheel-500"
                : "bg-anti-flash-white-500 border border-timberwolf-500 text-gunmetal-500 focus:ring-burnt-sienna-500"
            }`}
            placeholder="Enter recipe name"
          />
        </motion.div>

        {/* Recipe Description */}
        <motion.div variants={itemVariants} className="mb-6">
          <label
            className={`block text-lg font-semibold mb-2 ${
              darkMode ? "text-asparagus-500" : "text-gunmetal-600"
            }`}
          >
            Recipe Description
          </label>
          <textarea
            value={recipeDescription}
            onChange={(e) => setRecipeDescription(e.target.value)}
            className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300 ${
              darkMode
                ? "bg-gunmetal-400   border border-oxford-blue-200 text-snow-500 focus:ring-orange-wheel-500"
                : "bg-anti-flash-white-500 border border-timberwolf-500 text-gunmetal-500 focus:ring-burnt-sienna-500"
            }`}
            rows={4}
            placeholder="Enter recipe description"
          />
        </motion.div>

        {/* Recipe Image Upload */}
        <motion.div variants={itemVariants} className="mb-8">
          <label
            className={`block text-lg font-semibold mb-2 ${
              darkMode ? "text-asparagus-500" : "text-gunmetal-600"
            }`}
          >
            Upload Recipe Image
          </label>

          {!imagePreview ? (
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-300 ${
                darkMode
                  ? "bg-gunmetal-400  hover:border-orange-wheel-500"
                  : "border-timberwolf-500 hover:border-burnt-sienna-500"
              }`}
            >
              <label className="cursor-pointer block">
                <div className="flex flex-col items-center">
                  <ImageIcon
                    size={40}
                    className={
                      darkMode
                        ? "text-asparagus-500 mb-2"
                        : "text-amber-500 mb-2"
                    }
                  />
                  <p
                    className={darkMode ? "text-snow-400" : "text-gunmetal-600"}
                  >
                    Click to upload an image
                  </p>
                  <p className="text-sm mt-1 text-opacity-70">
                    JPG, PNG or GIF up to 5MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden h-60 group">
              <img
                src={imagePreview}
                alt="Recipe preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={removeImage}
                  className="p-2 bg-red-500 rounded-full text-white"
                >
                  <X size={20} />
                </motion.button>
              </div>
              <p className="mt-2 text-sm font-medium text-center">
                {image?.name}
              </p>
            </div>
          )}
        </motion.div>

        {/* Recipe Steps */}
        <motion.div variants={itemVariants}>
          <h2
            className={`text-2xl font-bold mb-4 ${
              darkMode ? "text-snow-500" : "text-gunmetal-500"
            }`}
          >
            Steps
          </h2>

          <AnimatePresence>
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 relative"
              >
                <div className="flex items-center mb-2">
                  <span
                    className={`font-semibold ${
                      darkMode ? "text-asparagus-500" : "text-gunmetal-600"
                    }`}
                  >
                    Step {index + 1}
                  </span>
                  {steps.length > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeStep(index)}
                      className={`ml-auto p-1 rounded-full ${
                        darkMode
                          ? "text-cardinal-500 hover:bg-oxford-blue-300"
                          : "text-burnt-sienna-500 hover:bg-timberwolf-500"
                      }`}
                    >
                      <X size={16} />
                    </motion.button>
                  )}
                </div>
                <textarea
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  placeholder={`Describe Step ${index + 1}`}
                  className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 resize-none transition-colors duration-300 ${
                    darkMode
                      ? "bg-gunmetal-400   border border-oxford-blue-200 text-snow-500 focus:ring-orange-wheel-500"
                      : "bg-anti-flash-white-500 border border-timberwolf-500 text-gunmetal-500 focus:ring-burnt-sienna-500"
                  }`}
                  rows={2}
                  onInput={(e) => {
                    const element = e.target as HTMLTextAreaElement
                    element.style.height = "auto"
                    element.style.height = element.scrollHeight + "px"
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Step Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addStep}
            className={`mt-4 px-6 py-3 rounded-lg font-medium flex items-center transition-colors duration-300 ${
              darkMode
                ? "bg-orange-wheel-500 text-oxford-blue-500 hover:bg-orange-wheel-400"
                : "bg-burnt-sienna-500 text-white hover:bg-burnt-sienna-600"
            }`}
          >
            <PlusCircle size={18} className="mr-2" />
            Add Step
          </motion.button>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex justify-center"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
            }}
            whileTap={{ scale: 0.95 }}
            className={`px-8 py-3 rounded-lg font-bold shadow-md transition-colors duration-300 ${
              darkMode
                ? "bg-cardinal-500 text-snow-500 hover:bg-cardinal-400"
                : "bg-amber-500 text-gunmetal-500 hover:bg-amber-600"
            }`}
          >
            Create Recipe
          </motion.button>
        </motion.div>
      </motion.div>
    </>
  )
}

export default SearchStructurePage
