import React, { useState, useEffect, useRef } from "react"
import { Search, Mic, Camera, ChefHat, TrendingUp, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useDarkMode } from "@/contexts/DarkModeContext"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import ISO6391 from "iso-639-1"

interface SearchPageProps {
  mode: "normal" | "experimental"
  setMode: (mode: "normal" | "experimental" | null) => void
  darkMode: boolean; 
}

function SearchPage({ mode, setMode }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const { darkMode } = useDarkMode()
  const [mounted, setMounted] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [supportLanguage, setSupportLanguage] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setSearchQuery(e.target.value)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    processSearch()
  }

  // Upload image to Cloudinary (similar to SearchStructurePage)
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
      setShowImageModal(true)
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
    setShowImageModal(false)
  }

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Add an optional parameter, e.g., 'queryOverride'
  const processSearch = async (queryOverride?: string) => {
    // Determine the query to use: override first, then state
    const currentQuery =
      queryOverride !== undefined ? queryOverride : searchQuery

    // Use 'currentQuery' instead of 'searchQuery' in the checks and query building
    if (!currentQuery.trim() && !image) {
      toast.error("Please enter a search query or upload an image")
      return
    }

    setLoading(true)

    try {
      const imageUrl = await uploadToCloudinary(image)
      let query = []

      // Use currentQuery here
      let finalQueryText = currentQuery.trim()

      // Append support language information if selected
      if (supportLanguage && finalQueryText) {
        const languageName = ISO6391.getName(supportLanguage) // Get full language name
        if (languageName) {
          // Add the requested text and language name
          finalQueryText += ` give ingredients in ${languageName} also for user's simplicity`
        }
      }

      if (finalQueryText) {
        // IMPORTANT: Encode the potentially modified query parameter value
        query.push(`recipeText=${(finalQueryText)}`)
      }

      if (imageUrl) {
        // Also good practice to encode the image URL if it might contain special characters
        query.push(`imageUrl=${(imageUrl)}`)
      }
      query.push(`mode=${mode}`)
      if (supportLanguage) {
        query.push(`language=${supportLanguage}`)
      }

      const queryString = query.join("&")
      navigate(`/dashboard/v1?${queryString}`)
    } catch (error) {
      console.error("Error processing search:", error)
      toast.error("Failed to process your request. Please try again.")
    } finally {
      setLoading(false)
    }
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
      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Image Upload Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative max-w-md w-full mx-4 p-6 rounded-2xl shadow-xl ${
                darkMode ? "bg-oxford-blue-400" : "bg-white"
              }`}
            >
              <button
                onClick={() => setShowImageModal(false)}
                className={`absolute top-3 right-3 p-2 rounded-full hover:bg-opacity-20 ${
                  darkMode
                    ? "text-snow-500 hover:bg-snow-700"
                    : "text-gunmetal-500 hover:bg-gunmetal-100"
                }`}
              >
                <X size={20} />
              </button>

              <h2
                className={`text-xl font-bold mb-4 ${
                  darkMode ? "text-snow-500" : "text-gunmetal-500"
                }`}
              >
                Upload Image
              </h2>

              {imagePreview && (
                <div className="mb-4 relative rounded-lg overflow-hidden h-48 group">
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
                </div>
              )}

              <div className="flex space-x-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={removeImage}
                  className={`flex-1 py-2 rounded-lg ${
                    darkMode
                      ? "bg-cardinal-500 text-snow-500 hover:bg-cardinal-400"
                      : "bg-gray-200 text-gunmetal-500 hover:bg-gray-300"
                  }`}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowImageModal(false)
                    processSearch()
                  }}
                  disabled={loading}
                  className={`flex-1 py-2 rounded-lg font-medium ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : darkMode
                      ? "bg-amber-500 text-oxford-blue-500 hover:bg-amber-400"
                      : "bg-burnt-sienna-500 text-white hover:bg-burnt-sienna-400"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Search with Image"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode toggle and theme toggle buttons */}
      <div className="w-full flex justify-end items-center p-4">
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
            className={`flex flex-col rounded-xl border-2 shadow-lg focus-within:shadow-xl transition-all duration-300 ${
              isSearchFocused
                ? darkMode
                  ? "border-amber-500 shadow-amber-500/30"
                  : "border-burnt-sienna-500 shadow-burnt-sienna-500/30"
                : darkMode
                ? "border-oxford-blue-400"
                : "border-timberwolf-400"
            } ${darkMode ? "bg-gunmetal-400" : "bg-anti-flash-white-500"}`}
          >
            {/* Input area with scrolling capability */}
            <div className="px-4 pt-3">
              <textarea
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                rows={1}
                className={`w-full bg-transparent outline-none  text-sm md:text-lg  resize-none overflow-y-auto max-h-32 ${
                  darkMode ? "text-snow-500" : "text-gunmetal-500"
                }`}
                placeholder="Search for recipes, ingredients, or cuisines"
                style={{
                  minHeight: "40px",
                  height: "auto",
                }}
                onInput={(e) => {
                  // Auto-resize the textarea
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto"
                  target.style.height =
                    Math.min(target.scrollHeight, 128) + "px"
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className={`absolute top-3 right-4 text-xl hover:opacity-80 ${
                    darkMode ? "text-snow-700" : "text-gunmetal-400"
                  }`}
                >
                  ×
                </button>
              )}
            </div>

            {/* Bottom toolbar with icons and language selector */}
            <div className="flex justify-between items-center px-4 py-2  ">
              {/* Left side - Image upload and language selection */}
              <div className="flex items-center space-x-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.15, rotate: -10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={openFileInput}
                  className={`p-1.5 rounded-full hover:bg-opacity-20 ${
                    darkMode
                      ? "text-snow-700 hover:bg-snow-900"
                      : "text-gunmetal-400 hover:bg-gunmetal-100"
                  } ${image && "text-amber-500"}`}
                  title="Upload image"
                >
                  <Camera size={18} />
                </motion.button>

                <select
                  value={supportLanguage}
                  onChange={(e) => setSupportLanguage(e.target.value)}
                  className={`text-sm p-1 rounded-md focus:outline-none focus:ring-1 transition-colors duration-300 ${
                    darkMode
                      ? "bg-gunmetal-400 border border-oxford-blue-200 text-snow-500 focus:ring-orange-wheel-500"
                      : "bg-anti-flash-white-500 border border-timberwolf-500 text-gunmetal-500 focus:ring-burnt-sienna-500"
                  }`}
                  title="Secondary Support Language"
                >
                  <option value="">Lang</option>
                  {ISO6391.getAllCodes().map((code) => (
                    <option key={code} value={code}>
                      {ISO6391.getName(code)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Right side - Voice and search */}
              <div className="flex items-center space-x-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-1.5 rounded-full hover:bg-opacity-20 ${
                    darkMode
                      ? "text-snow-700 hover:bg-snow-900"
                      : "text-gunmetal-400 hover:bg-gunmetal-100"
                  }`}
                  title="Voice search"
                >
                  <Mic size={18} />
                </motion.button>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-1.5 rounded-full ${
                    darkMode ? "text-amber-500" : "text-burnt-sienna-500"
                  }`}
                  title="Search"
                >
                  <Search size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Image Preview Badge (when image is uploaded) */}
          <AnimatePresence>
            {image && !showImageModal && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex justify-center mt-3"
              >
                <div
                  className={`flex items-center space-x-2 py-2 px-4 rounded-full cursor-pointer ${
                    darkMode
                      ? "bg-gunmetal-400 text-snow-500 hover:bg-gunmetal-300"
                      : "bg-white text-gunmetal-500 hover:bg-timberwolf-500"
                  } shadow-md`}
                  onClick={() => setShowImageModal(true)}
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <img
                      src={imagePreview || ""}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium">Image uploaded</span>
                  <X
                    size={16}
                    onClick={(e) => {
                      e.stopPropagation()
                      removeImage()
                    }}
                    className="hover:text-red-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
                  onClick={() => {
                    setSearchQuery(recipe) // Still useful to update the input field visually
                    processSearch(recipe) // Trigger search with the selected recipe
                  }}
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
                  onClick={() => {
                    // setSearchQuery(tag)
                    // setTimeout(() => processSearch(), 300)
                  }}
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
