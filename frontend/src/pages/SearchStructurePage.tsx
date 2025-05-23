import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDarkMode } from "@/contexts/DarkModeContext"

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}
import { PlusCircle, X, Image as ImageIcon, Mic } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import ISO6391 from "iso-639-1"

interface SearchStructurePageProps {
  mode: "normal" | "experimental"
  setMode: (mode: "normal" | "experimental" | null) => void
  darkMode: boolean
}

const SearchStructurePage: React.FC<SearchStructurePageProps> = ({
  mode,
  setMode,
}) => {
  const { darkMode } = useDarkMode()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [recipeName, setRecipeName] = useState("")
  const [recipeDescription, setRecipeDescription] = useState("")
  const [steps, setSteps] = useState<string[]>([])
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSpeechActive, setIsSpeechActive] = useState(false)
  const [supportLanguage, setSupportLanguage] = useState("")

  const handleSpeechToText = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      toast.error("Speech recognition is not supported in this browser")
      return
    }

    setIsSpeechActive((prev) => !prev)

    // If turning on speech recognition
    if (!isSpeechActive) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.lang = "en-US"
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("")

        setRecipeDescription((prev) => prev + " " + transcript)
      }

      recognition.onend = () => {
        setIsSpeechActive(false)
      }

      recognition.start()

      // Store recognition instance to stop it later
      ;(window as any).recognition = recognition
    } else {
      // Stop recognition if it exists
      if ((window as any).recognition) {
        ;(window as any).recognition.stop()
      }
    }
  }

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

  // Upload image to Cloudinary (similar to LandingPage)
  const uploadToCloudinary = async (file: File | null) => {
    if (!file) return null

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "Bawarchi.AI")

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dtgegh9ya/image/upload",
        {
          method: "POST",
          body: formData,
        }
      )

      if (!res.ok) {
        throw new Error("Failed to upload image to Cloudinary")
      }

      const data = await res.json()
      return data.secure_url // this is the public URL
    } catch (error) {
      toast.error("Failed to upload image. Please try again.")
      return null
    }
  }

  // Check if form is valid
  const isFormValid = () => {
    // Form is valid if at least recipe name or description is filled
    return (
      recipeName.trim() ||
      recipeDescription.trim() ||
      steps.some((step) => step.trim())
    )
  }

  // Submit form handler
  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error("Please provide at least recipe name, description or steps")
      return
    }

    setLoading(true)

    try {
      // Upload image to Cloudinary if it exists
      const imageUrl = await uploadToCloudinary(image)

      // Combine all text fields into one long text
      let combinedText = ""

      if (recipeName) {
        combinedText += `RecipeName:${recipeName}\n\n`
      }

      if (recipeDescription) {
        combinedText += `Description:${recipeDescription}\n\n`
      }

      if (steps.some((step) => step.trim())) {
        combinedText += "Steps:\n"
        steps.forEach((step, index) => {
          if (step.trim()) {
            combinedText += `${index + 1}.${step}\n`
          }
        })
      }

      // Build query parameters for navigation
      const query = []
      let finalCombinedText = combinedText // Start with the base combined text

      // Append support language information if selected and there is text
      if (supportLanguage && finalCombinedText) {
        const languageName = ISO6391.getName(supportLanguage) // Get full language name [cite: 154, 156]
        if (languageName) {
          // Add the requested text and language name
          finalCombinedText += ` give ingredients in ${languageName} also for user's simplicity`
        }
      }

      if (finalCombinedText) {
        // IMPORTANT: Encode the potentially modified query parameter value
        query.push(`recipeText=${encodeURIComponent(finalCombinedText)}`)
      }

      if (imageUrl) {
        // Also good practice to encode the image URL
        query.push(`imageUrl=${encodeURIComponent(imageUrl)}`)
      }

      // Add mode parameter to the query
      query.push(`mode=${mode}`)

      // Join to create query string
      const queryString = query.join("&")

      // Navigate to dashboard with parameters
      navigate(`/dashboard/v1?${queryString}`)
    } catch (error) {
      console.error("Error processing form:", error)
      toast.error("Failed to process your request. Please try again.")
    } finally {
      setLoading(false)
    }
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

        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recipe Name */}
            <div className="w-full md:w-1/2">
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
            </div>

            {/* Secondary Support Language */}
            <div className="w-full md:w-1/2">
              <label
                className={`block text-lg font-semibold mb-2 ${
                  darkMode ? "text-asparagus-500" : "text-gunmetal-600"
                }`}
              >
                Secondary Support Language (optional)
              </label>
              <select
                value={supportLanguage}
                onChange={(e) => setSupportLanguage(e.target.value)}
                className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300 ${
                  darkMode
                    ? "bg-gunmetal-400 border border-oxford-blue-200 text-snow-500 focus:ring-orange-wheel-500"
                    : "bg-anti-flash-white-500 border border-timberwolf-500 text-gunmetal-500 focus:ring-burnt-sienna-500"
                }`}
              >
                <option value="">None</option>
                {ISO6391.getAllCodes().map((code) => (
                  <option key={code} value={code}>
                    {ISO6391.getName(code)}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
          <div className="relative">
            <textarea
              value={recipeDescription}
              onChange={(e) => setRecipeDescription(e.target.value)}
              className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-300 pr-12 ${
                darkMode
                  ? "bg-gunmetal-400 border border-oxford-blue-200 text-snow-500 focus:ring-orange-wheel-500"
                  : "bg-anti-flash-white-500 border border-timberwolf-500 text-gunmetal-500 focus:ring-burnt-sienna-500"
              }`}
              rows={4}
              placeholder="Enter recipe description"
            />
            <motion.div
              className="absolute right-3 top-3 cursor-pointer"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              animate={
                isSpeechActive
                  ? {
                      scale: [1, 1.2, 1],
                      color: darkMode
                        ? ["#F8F9FA", "#FF5C39", "#F8F9FA"]
                        : ["#393E46", "#FF5C39", "#393E46"],
                    }
                  : {}
              }
              transition={
                isSpeechActive
                  ? {
                      repeat: Infinity,
                      duration: 1.5,
                    }
                  : {}
              }
              onClick={handleSpeechToText}
            >
              <Mic
                size={24}
                className={`${
                  isSpeechActive
                    ? "text-cardinal-500"
                    : darkMode
                    ? "text-asparagus-500 hover:text-orange-wheel-500"
                    : "text-amber-500 hover:text-burnt-sienna-500"
                } transition-colors duration-300`}
              />
              {isSpeechActive && (
                <motion.div
                  className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-red-500"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
            </motion.div>
          </div>
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
                  ? "bg-gunmetal-400 hover:border-orange-wheel-500"
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
                      ? "bg-gunmetal-400 border border-oxford-blue-200 text-snow-500 focus:ring-orange-wheel-500"
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
            onClick={handleSubmit}
            disabled={loading || !isFormValid()}
            className={`px-8 py-3 rounded-lg font-bold shadow-md transition-colors duration-300 ${
              loading || !isFormValid()
                ? "bg-gray-400 cursor-not-allowed text-gray-200"
                : darkMode
                ? "bg-cardinal-500 text-snow-500 hover:bg-cardinal-400"
                : "bg-amber-500 text-gunmetal-500 hover:bg-amber-600"
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2 inline-block"></div>
                Processing...
              </>
            ) : (
              "See the magic✨"
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </>
  )
}

export default SearchStructurePage
