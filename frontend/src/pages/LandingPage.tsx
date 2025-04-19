import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, ArrowRight, FileText, Type, Moon, Sun } from "lucide-react"
import { toast } from "sonner"
import { useDarkMode } from "@/contexts/DarkModeContext"
import Navbar from "@/components/Navbar"

const LandingPage = () => {
  const navigate = useNavigate()
  const { darkMode, setDarkMode } = useDarkMode()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState({
    image1: null,
    image2: null,
  })
  const [previews, setPreviews] = useState({
    image1: null,
    image2: null,
  })
  const [recipeTexts, setRecipeTexts] = useState({
    name1: "",
    fullRecipe1: "",
    name2: "",
    fullRecipe2: "",
  })

  // Apply dark mode class to body when darkMode state changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }, [darkMode])

  const handleImageChange = (e, imageKey) => {
    const file = e.target.files[0]
    if (!file) return

    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file)
    setPreviews((prev) => ({
      ...prev,
      [imageKey]: previewUrl,
    }))

    // Store the file
    setImages((prev) => ({
      ...prev,
      [imageKey]: file,
    }))
  }

  const handleTextChange = (e, textKey) => {
    setRecipeTexts((prev) => ({
      ...prev,
      [textKey]: e.target.value,
    }))
  }

  const isFormValid = () => {
    // Form is valid if at least one image is uploaded OR any text field has content
    return (
      images.image1 ||
      images.image2 ||
      recipeTexts.name1.trim() ||
      recipeTexts.fullRecipe1.trim() ||
      recipeTexts.name2.trim() ||
      recipeTexts.fullRecipe2.trim()
    )
  }


  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate that at least one field has content
    if (!isFormValid()) {
      toast.error("Please provide at least one image or recipe information")
      return
    }

    setLoading(true)

    try {
      // Simulate uploading process
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Convert images to base64 strings if they exist
      const image1Base64 = images.image1
        ? await fileToBase64(images.image1)
        : null

      // Build query parameters for navigation
      const params = new URLSearchParams()

      // Only send one set of data (simplified from your original)
      if (image1Base64) {
        params.append("image1", encodeURIComponent(image1Base64))
      }
      const image2Base64 = images.image2
        ? await fileToBase64(images.image2)
        : null

      if (image2Base64) {
        params.append("image2", encodeURIComponent(image2Base64))
      }


      if (recipeTexts.name1) {
        params.append("recipeName1", encodeURIComponent(recipeTexts.name1))
      }

      if (recipeTexts.fullRecipe1) {
        params.append(
          "recipeText1",
          encodeURIComponent(recipeTexts.fullRecipe1)
        )
      }

      // Navigate to Index page with the collected data
      navigate(`/dashboard?${params.toString()}`)
    } catch (error) {
      console.error("Error processing form:", error)
      toast.error("Failed to process your request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Helper function to convert File to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Custom Navbar with centered content and dark mode toggle */}
      <header className="py-4 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex-1">{/* Empty div for spacing */}</div>
          <div className="flex-1 text-center">
            <h1
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Bawarchi.AI
            </h1>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-200" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1
            className={`text-4xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Welcome to Bawarchi.AI
          </h1>
          <p
            className={`mt-4 text-xl ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Upload images or enter recipe details to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="max-w-2xl mx-auto">
            {/* Recipe Section */}
            <div
              className={`p-6 rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow-md`}
            >
              <h2
                className={`text-xl font-semibold mb-4 flex items-center justify-center ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                <FileText className="mr-2 h-5 w-5" />
                Recipe Details
              </h2>

              {/* Recipe Name + Upload Image beside it */}
              <div className="mb-6">
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Recipe Name & Food Image
                </label>
                <div className="flex items-center space-x-2">
                  <div
                    className="flex-1 flex rounded-md shadow-sm ring-1 ring-inset 
      ${darkMode ? 'ring-gray-600 bg-gray-700' : 'ring-gray-300 bg-white'}"
                  >
                    {/* <span
                      className={`flex items-center pl-3 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <Type className="h-4 w-4" />
                    </span> */}
                    <input
                      type="text"
                      value={recipeTexts.name1}
                      onChange={(e) => handleTextChange(e, "name1")}
                      placeholder="e.g. Chocolate Chip Cookies"
                      className={`block flex-1 border-0 py-1.5 pl-2 ${
                        darkMode
                          ? "bg-gray-700 text-white placeholder:text-gray-400"
                          : "bg-white text-gray-900 placeholder:text-gray-400"
                      } focus:ring-0 sm:text-sm rounded-md`}
                    />
                  </div>
                  <label
                    className="cursor-pointer p-1 rounded-full hover:bg-gray-300 "
                    title="Upload Food Image"
                  >
                    <div
                      className={`h-8 w-8 flex items-center justify-center rounded-full 
                         ${
                           darkMode
                             ? "bg-gray-700 text-white placeholder:text-gray-400"
                             : "bg-white text-gray-900 placeholder:text-gray-400"
                         }
                        `}
                    >
                      <img
                        src={
                          darkMode
                            ? "./assets/upload-dark.png"
                            : "./assets/upload-light.png"
                        }
                        alt="Upload"
                        className="h-6 w-6"
                      />
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "image1")}
                    />
                  </label>
                </div>
                {previews.image1 && (
                  <div className="mt-3">
                    <img
                      src={previews.image1}
                      alt="Food Preview"
                      className="h-20 object-contain rounded"
                    />
                  </div>
                )}
              </div>

              {/* Full Recipe Text Input */}
              <div className="mb-6">
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  } `}
                >
                  Recipe Details (Optional)
                </label>
                <textarea
                  value={recipeTexts.fullRecipe1}
                  onChange={(e) => handleTextChange(e, "fullRecipe1")}
                  placeholder="  Paste or type full recipe here..."
                  rows={4}
                  className={` block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ${
                    darkMode
                      ? "bg-gray-700 text-white placeholder:text-gray-400 ring-gray-600"
                      : "bg-white text-gray-900 placeholder:text-gray-400 ring-gray-300"
                  } focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm`}
                />
              </div>

              {/* Recipe Page/Screenshot Upload */}
              <div
                className={`mt-6 p-4 rounded-lg border-2 border-dashed ${
                  darkMode ? "border-gray-700" : "border-gray-300"
                }`}
              >
                <div className="text-center">
                  <Upload
                    className={`mx-auto h-8 w-8 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <h3 className="mt-1 text-sm font-medium">
                    Upload Recipe Screenshot (Optional)
                  </h3>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    JPG, PNG or GIF up to 10MB
                  </p>
                </div>
                <div className="mt-2 flex justify-center">
                  <label
                    className={`cursor-pointer px-3 py-1.5 text-sm rounded-md ${
                      darkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    <span>Select Image</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "image2")}
                    />
                  </label>
                </div>
                {previews.image2 && (
                  <div className="mt-3">
                    <img
                      src={previews.image2}
                      alt="Recipe Page Preview"
                      className="mx-auto h-32 w-auto object-contain rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className={`flex items-center px-6 py-3 rounded-md text-white ${
                loading || !isFormValid()
                  ? "bg-gray-400 cursor-not-allowed"
                  : darkMode
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  Find Recipes <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-12 text-center">
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Provide images of ingredients, recipe names, or full recipe text to
            get started
          </p>
        </div>
      </main>
    </div>
  )
}

export default LandingPage
