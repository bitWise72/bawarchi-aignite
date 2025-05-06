import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
// Assuming Framer Motion is installed: npm install framer-motion
// Heroicons for menu icon: npm install @heroicons/react

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline" // Using heroicons for menu/close icons
import Navbar from "@/components/Navbar" // Assuming this Navbar component exists and handles dark mode internally or receives the prop
import { useDarkMode } from "@/contexts/DarkModeContext" // Assuming DarkModeContext is set up

// Placeholder data structure for user profile
const initialProfileData = {
  profilePicture: "/placeholder-profile.png", // Placeholder image path
  firstName: "",
  lastName: "",
  email: "",
  dateOfBirth: "",
  biologicalSex: "Male", // Default value
  height: null, // Use null for numerical fields that could be empty
  currentWeight: null,
  goalWeight: null,
  activityLevel: "Sedentary", // Default value
  dietaryStyle: [], // Initialize as empty array
  allergies: [], // Initialize as empty array
  dislikes: [], // Initialize as empty array
  calorieTarget: null,
  proteinGoal: null, // in grams
  carbGoal: null, // in grams
  fatGoal: null, // in grams
  fiberGoal: null, // in grams
  healthConditions: [], // Initialize as empty array
  fitnessGoals: [], // Initialize as empty array
  streak: 0, // Days streak (typically calculated, not edited)
  mealsLoggedThisWeek: 0, // (typically calculated, not edited)
}

// Sidebar navigation links
const sidebarLinks = [
  { name: "Profile (Biodata + Medical)", href: "#profile" },
  { name: "Food Logging", href: "#food-logging" },
  { name: "User Recipe History", href: "#recipe-history" },
]

// Framer Motion variants for section animation
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

// Framer Motion variants for sidebar animation
const sidebarVariants = {
  hidden: { x: "-100%" },
  visible: { x: "0%" },
  exit: { x: "-100%" },
}

// Main Profile Page Component
const ProfilePage = () => {
  const { darkMode, setDarkMode } = useDarkMode() // Use dark mode from context
  // Attempt to load user data from localStorage, default to empty object if not found
  // In a real app, this would likely come from an authenticated user context or API call
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  console.log("User Data from localStorage:", user)

  // State for profile data, initialized with defaults but potentially overwritten by loaded user data
  const [profileData, setProfileData] = useState({
    ...initialProfileData,
    // Overwrite with actual user data if available (example: name, image)
    firstName: user?.name?.split(" ")[0] || initialProfileData.firstName,
    lastName: user?.name?.split(" ")[1] || initialProfileData.lastName,
    email: user?.email || initialProfileData.email,
    profilePicture: user?.image || initialProfileData.profilePicture,
    // In a real app, load other profile data fields from user object or API
    // For now, keep other initialProfileData defaults or load from a dedicated profile object if stored separately
  })

  const [activeSection, setActiveSection] = useState("#profile") // State to manage active section in sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // State to control sidebar visibility on mobile
  // Use useEffect to determine initial mobile state and set sidebar visibility
  const [isMobile, setIsMobile] = useState(false) // Initial state before useEffect

  // Effect to update isMobile state on window resize and set initial sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Set sidebar visibility based on screen size
      setIsSidebarOpen(!mobile) // Open sidebar on desktop, close on mobile
    }

    // Set initial state
    handleResize()

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, []) // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Handle input changes for single value fields
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target
    // Convert numerical inputs to numbers, but allow empty string/null
    const processedValue =
      type === "number" && value !== "" ? parseFloat(value) : value
    setProfileData({ ...profileData, [name]: processedValue })
  }

  // Handle array input changes (e.g., allergies, dietary style)
  // Assumes comma-separated string input
  const handleArrayInputChange = (name: string, value: string) => {
    setProfileData({
      ...profileData,
      [name]: value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== ""), // Filter out empty strings
    })
  }

  // Handle Save Changes
  const handleSaveChanges = () => {
    console.log("Attempting to save changes:", profileData)
    // TODO: Implement actual save logic here (e.g., API call to backend)
    // You would typically send profileData to your backend API
    alert("Profile changes save triggered (API call would go here)!")
    // After successful save, you might update local storage or a global state
    // localStorage.setItem("userProfileData", JSON.stringify(profileData));
  }

  // Handle Cancel
  const handleCancel = () => {
    console.log("Changes cancelled, resetting form.")
    // TODO: Implement actual cancel logic - usually means re-fetching or resetting to the last saved state
    // For this example, reset to the data loaded on component mount (or initial defaults)
    // In a real app, you might store the original data in a separate state variable for this
    // For simplicity here, let's just log it. Resetting to initialProfileData might not be desired
    // if user data was loaded. A better approach would be to revert to the state *before* editing started.
    alert("Changes cancelled (form not reset in this example)!")
    // A real cancel might involve:
    // setProfileData(originalProfileData); // if original data was stored
  }

  // Handle Profile Picture Change
  const handleProfilePictureChange = () => {
    console.log("Change Profile Picture button clicked.")
    // TODO: Implement file upload or selection logic here
    alert("Profile picture change functionality not yet implemented.")
  }

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Handle sidebar link click (closes sidebar on mobile)
  const handleLinkClick = (href: string) => {
    setActiveSection(href)
    if (isMobile) {
      setIsSidebarOpen(false) // Close sidebar on mobile after clicking a link
    }
    // In a real app with routing (like Next.js or React Router), you would navigate here
    // e.g., router.push(href);
  }

  // Determine main content margin based on sidebar visibility and mobile state
  const mainContentMarginClass = isMobile ? "" : isSidebarOpen ? "md:ml-10" : ""

  return (
    // Apply dark mode background and text colors to the main container
    <div
      className={`flex flex-col min-h-screen font-sans transition-colors duration-300
                 ${
                   darkMode
                     ? "bg-gray-900 text-gray-100"
                     : "bg-gray-100 text-gray-800"
                 }`}
    >
      {/* Navbar */}
      {/* Navbar should also handle dark mode based on the context */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        name={user?.name || "Guest"} // Display user name from localStorage or "Guest"
        image={user?.image || initialProfileData.profilePicture} // Display user image or placeholder
      />
      {/* Mobile Sidebar Toggle Button */}
      {/* Only show toggle button on mobile */}
      <div
        className={`flex items-center justify-between p-4 transition-colors duration-300
                  ${
                    darkMode
                      ? "bg-gray-800 text-gray-100 shadow-md"
                      : "bg-white text-gray-800 shadow-md"
                  }
                  md:hidden`} // Hide on medium and up screens
      >
        <span className="text-xl font-bold">Nutrition App</span>
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-md focus:outline-none focus:ring-2 transition-colors duration-300
                    ${
                      darkMode
                        ? "text-gray-100 focus:ring-gray-500"
                        : "text-gray-800 focus:ring-gray-500"
                    }`}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>
      {/* Main content area including sidebar and main content */}
      <div className="flex flex-1">
        {/* Use flex-1 to take up remaining vertical space */}

        {/* Sidebar */}
        <AnimatePresence initial={false}>
          {" "}
          {/* initial={false} prevents exit animation on mount */}
          {(isSidebarOpen || !isMobile) && ( // Show sidebar if open on mobile or always on desktop
            <motion.div
              key="sidebar" // Key is important for AnimatePresence
              className={`w-64 transition-colors duration-300 p-6 space-y-6 flex-shrink-0
                        fixed inset-y-0 left-0 transform md:relative md:translate-x-0 z-40 md:z-auto
                         ${
                           darkMode
                             ? "bg-gray-800 text-gray-100"
                             : "bg-gray-800 text-white"
                         }`} // Apply dark mode colors
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit" // Add exit variant
              transition={{ duration: 0.3 }}
            >
              <div className="text-2xl font-bold mb-8 md:block hidden">
                Nutrition App
              </div>{" "}
              {/* App Title/Logo - Hide on mobile toggle view */}
              <div className="text-lg font-semibold mb-4 mt-10 md:mt-0">
                Profile Navigation
              </div>{" "}
              {/* Adjust margin for mobile */}
              <nav>
                <ul className="space-y-2">
                  {sidebarLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault()
                          handleLinkClick(link.href)
                        }}
                        className={`block py-2 px-4 rounded transition duration-200
                           ${
                             activeSection === link.href
                               ? `${
                                   darkMode
                                     ? "bg-gray-700 text-orange-400"
                                     : "bg-gray-700 text-teal-400"
                                 }` // Active link color
                               : `${
                                   darkMode
                                     ? "hover:bg-gray-700 hover:text-orange-400"
                                     : "hover:bg-gray-700 hover:text-teal-400"
                                 }` // Hover link color
                           }`}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Overlay when sidebar is open on mobile */}
        <AnimatePresence>
          {isSidebarOpen &&
            isMobile && ( // Only show overlay on mobile when sidebar is open
              <div
                onClick={toggleSidebar} // Close sidebar when clicking overlay
              >
                <motion.div
                  key="sidebar-overlay"
                  className="fixed inset-0 bg-black bg-opacity-50 z-30" // Overlay
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div
          className={`flex-1 p-4 md:p-8 overflow-y-auto transition-all duration-300
                     ${mainContentMarginClass}`} // Dynamic margin
        >
          <h1
            className={`text-2xl md:text-3xl font-bold mb-6 md:mb-8 transition-colors duration-300
                         ${darkMode ? "text-gray-100" : "text-gray-800"}`}
          >
            {/* Dynamically change title based on active section */}
            {sidebarLinks
              .find((link) => link.href === activeSection)
              ?.name.replace(" (Biodata + Medical)", "") || "Profile"}
          </h1>

          {/* Profile Section Content - Conditional Rendering based on activeSection */}
          {activeSection === "#profile" && (
            <motion.div
              id="profile-content"
              className={`p-4 md:p-6 rounded-lg shadow-md transition-colors duration-300 space-y-6
                         ${darkMode ? "bg-gray-700" : "bg-white"}`} // Apply dark mode background
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Profile Picture Section */}
              <motion.div
                className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <img
                  src={profileData.profilePicture} // Use profileData's picture
                  alt="Profile"
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 transition-colors duration-300
                             ${
                               darkMode
                                 ? "border-orange-400"
                                 : "border-teal-400"
                             }`} // Apply dark mode border color
                />
                <button
                  onClick={handleProfilePictureChange}
                  className={`px-4 py-2 rounded-md transition duration-200 text-sm sm:text-base
                             ${
                               darkMode
                                 ? "bg-orange-600 text-white hover:bg-orange-700"
                                 : "bg-teal-500 text-white hover:bg-teal-600"
                             }`} // Apply dark mode button styles
                >
                  Change Profile Picture
                </button>
              </motion.div>

              {/* Personal Information & Health Metrics */}
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3, duration: 0.5 }} // Add delay for staggered animation
              >
                <h2
                  className={`text-lg md:text-xl font-semibold mb-4 transition-colors duration-300
                               ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                >
                  Personal Information & Health Metrics
                </h2>
                {/* Adjusted grid for mobile: 1 column on small, 2 on medium and up */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label
                      className={`text-sm font-medium transition-colors duration-300
                                       ${
                                         darkMode
                                           ? "text-gray-300"
                                           : "text-gray-600"
                                       }`}
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name" // Placeholder
                      className={`mt-1 p-2 border rounded-md text-sm md:text-base transition-colors duration-300
                                 ${
                                   darkMode
                                     ? "bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400"
                                     : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                                 }`} // Apply dark mode input styles
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className={`text-sm font-medium transition-colors duration-300
                                       ${
                                         darkMode
                                           ? "text-gray-300"
                                           : "text-gray-600"
                                       }`}
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name" // Placeholder
                      className={`mt-1 p-2 border rounded-md text-sm md:text-base transition-colors duration-300
                                 ${
                                   darkMode
                                     ? "bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400"
                                     : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                                 }`} // Apply dark mode input styles
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className={`text-sm font-medium transition-colors duration-300
                                       ${
                                         darkMode
                                           ? "text-gray-300"
                                           : "text-gray-600"
                                       }`}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email" // Placeholder
                      className={`mt-1 p-2 border rounded-md text-sm md:text-base transition-colors duration-300
                                 ${
                                   darkMode
                                     ? "bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400"
                                     : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                                 }`} // Apply dark mode input styles
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className={`text-sm font-medium transition-colors duration-300
                                       ${
                                         darkMode
                                           ? "text-gray-300"
                                           : "text-gray-600"
                                       }`}
                    >
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={profileData.dateOfBirth}
                      onChange={handleInputChange}
                      className={`mt-1 p-2 border rounded-md text-sm md:text-base transition-colors duration-300
                                 ${
                                   darkMode
                                     ? "bg-gray-600 border-gray-500 text-gray-100"
                                     : "bg-white border-gray-300 text-gray-800"
                                 }`} // Apply dark mode input styles
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className={`text-sm font-medium transition-colors duration-300
                                       ${
                                         darkMode
                                           ? "text-gray-300"
                                           : "text-gray-600"
                                       }`}
                    >
                      Biological Sex
                    </label>
                    <select
                      name="biologicalSex"
                      value={profileData.biologicalSex}
                      onChange={handleInputChange}
                      className={`mt-1 p-2 border rounded-md text-sm md:text-base transition-colors duration-300
                                 ${
                                   darkMode
                                     ? "bg-gray-600 border-gray-500 text-gray-100"
                                     : "bg-white border-gray-300 text-gray-800"
                                 }`} // Apply dark mode select styles
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label
                      className={`text-sm font-medium transition-colors duration-300
                                       ${
                                         darkMode
                                           ? "text-gray-300"
                                           : "text-gray-600"
                                       }`}
                    >
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={profileData.height || ""} // Use empty string for null/undefined in input value
                      onChange={handleInputChange}
                      placeholder="e.g., 175" // Placeholder
                      className={`mt-1 p-2 border rounded-md text-sm md:text-base transition-colors duration-300
                                 ${
                                   darkMode
                                     ? "bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400"
                                     : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                                 }`} // Apply dark mode input styles
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className={`text-sm font-medium transition-colors duration-300
                                       ${
                                         darkMode
                                           ? "text-gray-300"
                                           : "text-gray-600"
                                       }`}
                    >
                      Current Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="currentWeight"
                      value={profileData.currentWeight || ""} // Use empty string for null/undefined
                      onChange={handleInputChange}
                      placeholder="e.g., 70" // Placeholder
                      className={`mt-1 p-2 border rounded-md text-sm md:text-base transition-colors duration-300
                                 ${
                                   darkMode
                                     ? "bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400"
                                     : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                                 }`} // Apply dark mode input styles
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className={`text-sm font-medium transition-colors duration-300
                                       ${
                                         darkMode
                                           ? "text-gray-300"
                                           : "text-gray-600"
                                       }`}
                    >
                      Goal Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="goalWeight"
                      value={profileData.goalWeight || ""} // Use empty string for null/undefined
                      onChange={handleInputChange}
                      placeholder="e.g., 68" // Placeholder
                      className={`mt-1 p-2 border rounded-md text-sm md:text-base transition-colors duration-300
                                 ${
                                   darkMode
                                     ? "bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400"
                                     : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                                 }`} // Apply dark mode input styles
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className={`text-sm font-medium transition-colors duration-300
                                       ${
                                         darkMode
                                           ? "text-gray-300"
                                           : "text-gray-600"
                                       }`}
                    >
                      Activity Level
                    </label>
                    <select
                      name="activityLevel"
                      value={profileData.activityLevel}
                      onChange={handleInputChange}
                      className={`mt-1 p-2 border rounded-md text-sm md:text-base transition-colors duration-300
                                 ${
                                   darkMode
                                     ? "bg-gray-600 border-gray-500 text-gray-100"
                                     : "bg-white border-gray-300 text-gray-800"
                                 }`} // Apply dark mode select styles
                    >
                      <option value="Sedentary">
                        Sedentary (little or no exercise)
                      </option>
                      <option value="Lightly Active">
                        Lightly Active (light exercise/sports 1-3 days/week)
                      </option>
                      <option value="Moderately Active">
                        Moderately Active (moderate exercise/sports 3-5
                        days/week)
                      </option>
                      <option value="Very Active">
                        Very Active (hard exercise/sports 6-7 days a week)
                      </option>
                      <option value="Extra Active">
                        Extra Active (very hard exercise/sports & physical job)
                      </option>
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Dietary Preferences & Goals */}
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4, duration: 0.5 }} // Add delay
              >
                <h2
                  className={`text-lg md:text-xl font-semibold mb-4 transition-colors duration-300
                               ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                >
                  Dietary Preferences & Goals
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label
                      className={`text-sm font-medium transition-colors duration-300
                                       ${
                                         darkMode
                                           ? "text-gray-300"
                                           : "text-gray-600"
                                       }`}
                    >
                      Dietary Style (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="dietaryStyle"
                      value={profileData.dietaryStyle.join(", ")}
                      onChange={(e) =>
                        handleArrayInputChange("dietaryStyle", e.target.value)
                      }
                      placeholder="e.g., Vegetarian, Vegan, Keto" // Placeholder
                      className={`mt-1 p-2 border rounded-md text-sm md:text-base transition-colors duration-300
                                 ${
                                   darkMode
                                     ? "bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400"
                                     : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                                 }`} // Apply dark mode input styles
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className={`text-sm font-medium transition-colors duration-300
                                       ${
                                         darkMode
                                           ? "text-gray-300"
                                           : "text-gray-600"
                                       }`}
                    >
                      Allergies (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="allergies"
                      value={profileData.allergies.join(", ")}
                      onChange={(e) =>
                        handleArrayInputChange("allergies", e.target.value)
                      }
                      placeholder="e.g., Peanuts, Gluten, Dairy" // Placeholder
                      className={`mt-1 p-2 border rounded-md text-sm md:text-base transition-colors duration-300
                                 ${
                                   darkMode
                                     ? "bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400"
                                     : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                                 }`} // Apply dark mode input styles
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className={`text-sm font-medium transition-colors duration-300
                                       ${
                                         darkMode
                                           ? "text-gray-300"
                                           : "text-gray-600"
                                       }`}
                    >
                      Food Dislikes (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="dislikes"
                      value={profileData.dislikes.join(", ")}
                      onChange={(e) =>
                        handleArrayInputChange("dislikes", e.target.value)
                      }
                      placeholder="e.g., Mushrooms, Olives" // Placeholder
                      className={`mt-1 p-2 border rounded-md text-sm md:text-base transition-colors duration-300
                                 ${
                                   darkMode
                                     ? "bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400"
                                     : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                                 }`} // Apply dark mode input styles
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className={`text-sm font-medium transition-colors duration-300
                                       ${
                                         darkMode
                                           ? "text-gray-300"
                                           : "text-gray-600"
                                       }`}
                    >
                      Calorie Target
                    </label>
                    <input
                      type="number"
                      name="calorieTarget"
                      value={profileData.calorieTarget || ""} // Use empty string for null/undefined
                      onChange={handleInputChange}
                      placeholder="e.g., 2000" // Placeholder
                      className={`mt-1 p-2 border rounded-md text-sm md:text-base transition-colors duration-300
                                 ${
                                   darkMode
                                     ? "bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400"
                                     : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                                 }`} // Apply dark mode input styles
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className={`text-sm font-medium transition-colors duration-300
                                       ${
                                         darkMode
                                           ? "text-gray-300"
                                           : "text-gray-600"
                                       }`}
                    >
                      Protein Goal (g)
                    </label>
                    <input
                      type="number"
                      name="proteinGoal"
                      value={profileData.proteinGoal || ""} // Use empty string for null/undefined
                      onChange={handleInputChange}
                      placeholder="e.g., 100" // Placeholder
                      className={`mt-1 p-2 border rounded-md text-sm md:text-base transition-colors duration-300
                                 ${
                                   darkMode
                                     ? "bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400"
                                     : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                                 }`} // Apply dark mode input styles
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className={`text-sm font-medium transition-colors duration-300
                                       ${
                                         darkMode
                                           ? "text-gray-300"
                                           : "text-gray-600"
                                       }`}
                    >
                      Carbohydrate Goal (g)
                    </label>
                    <input
                      type="number"
                      name="carbGoal"
                      value={profileData.carbGoal || ""} // Use empty string for null/undefined
                      onChange={handleInputChange}
                      placeholder="e.g., 250" // Placeholder
                      className={`mt-1 p-2 border rounded-md text-sm md:text-base transition-colors duration-300
                                 ${
                                   darkMode
                                     ? "bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400"
                                     : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                                 }`} // Apply dark mode input styles
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className={`text-sm font-medium transition-colors duration-300
                                       ${
                                         darkMode
                                           ? "text-gray-300"
                                           : "text-gray-600"
                                       }`}
                    >
                      Fat Goal (g)
                    </label>
                    <input
                      type="number"
                      name="fatGoal"
                      value={profileData.fatGoal || ""} // Use empty string for null/undefined
                      onChange={handleInputChange}
                      placeholder="e.g., 60" // Placeholder
                      className={`mt-1 p-2 border rounded-md text-sm md:text-base transition-colors duration-300
                                 ${
                                   darkMode
                                     ? "bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400"
                                     : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                                 }`} // Apply dark mode input styles
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className={`text-sm font-medium transition-colors duration-300
                                       ${
                                         darkMode
                                           ? "text-gray-300"
                                           : "text-gray-600"
                                       }`}
                    >
                      Fiber Goal (g)
                    </label>
                    <input
                      type="number"
                      name="fiberGoal"
                      value={profileData.fiberGoal || ""} // Use empty string for null/undefined
                      onChange={handleInputChange}
                      placeholder="e.g., 30" // Placeholder
                      className={`mt-1 p-2 border rounded-md text-sm md:text-base transition-colors duration-300
                                 ${
                                   darkMode
                                     ? "bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400"
                                     : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                                 }`} // Apply dark mode input styles
                    />
                  </div>
                </div>
              </motion.div>

              {/* Health Conditions & App Progress */}
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5, duration: 0.5 }} // Add delay
              >
                <h2
                  className={`text-lg md:text-xl font-semibold mb-4 transition-colors duration-300
                               ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                >
                  Health Conditions & App Progress
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label
                      className={`text-sm font-medium transition-colors duration-300
                                       ${
                                         darkMode
                                           ? "text-gray-300"
                                           : "text-gray-600"
                                       }`}
                    >
                      Health Conditions (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="healthConditions"
                      value={profileData.healthConditions.join(", ")}
                      onChange={(e) =>
                        handleArrayInputChange(
                          "healthConditions",
                          e.target.value
                        )
                      }
                      placeholder="e.g., Diabetes, Hypertension" // Placeholder
                      className={`mt-1 p-2 border rounded-md text-sm md:text-base transition-colors duration-300
                                 ${
                                   darkMode
                                     ? "bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400"
                                     : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                                 }`} // Apply dark mode input styles
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className={`text-sm font-medium transition-colors duration-300
                                       ${
                                         darkMode
                                           ? "text-gray-300"
                                           : "text-gray-600"
                                       }`}
                    >
                      Fitness Goals (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="fitnessGoals"
                      value={profileData.fitnessGoals.join(", ")}
                      onChange={(e) =>
                        handleArrayInputChange("fitnessGoals", e.target.value)
                      }
                      placeholder="e.g., Weight Loss, Muscle Gain" // Placeholder
                      className={`mt-1 p-2 border rounded-md text-sm md:text-base transition-colors duration-300
                                 ${
                                   darkMode
                                     ? "bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400"
                                     : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                                 }`} // Apply dark mode input styles
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className={`text-sm font-medium transition-colors duration-300
                                       ${
                                         darkMode
                                           ? "text-gray-300"
                                           : "text-gray-600"
                                       }`}
                    >
                      Logging Streak (Days)
                    </label>
                    <input
                      type="number"
                      name="streak"
                      value={profileData.streak}
                      onChange={handleInputChange} // Still include handler even if readOnly, in case you want to enable editing later
                      readOnly // Streak is typically calculated, not edited directly
                      className={`mt-1 p-2 border rounded-md text-sm md:text-base cursor-not-allowed transition-colors duration-300
                                 ${
                                   darkMode
                                     ? "bg-gray-600 border-gray-500 text-gray-400"
                                     : "bg-gray-200 border-gray-300 text-gray-600"
                                 }`} // Styled for readOnly
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className={`text-sm font-medium transition-colors duration-300
                                       ${
                                         darkMode
                                           ? "text-gray-300"
                                           : "text-gray-600"
                                       }`}
                    >
                      Meals Logged This Week
                    </label>
                    <input
                      type="number"
                      name="mealsLoggedThisWeek"
                      value={profileData.mealsLoggedThisWeek}
                      onChange={handleInputChange} // Still include handler
                      readOnly // This is also typically calculated
                      className={`mt-1 p-2 border rounded-md text-sm md:text-base cursor-not-allowed transition-colors duration-300
                                 ${
                                   darkMode
                                     ? "bg-gray-600 border-gray-500 text-gray-400"
                                     : "bg-gray-200 border-gray-300 text-gray-600"
                                 }`} // Styled for readOnly
                    />
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }} // Add delay
              >
                <button
                  onClick={handleSaveChanges}
                  className={`px-6 py-2 rounded-md transition duration-200 text-sm md:text-base
                             ${
                               darkMode
                                 ? "bg-green-700 text-white hover:bg-green-800"
                                 : "bg-green-600 text-white hover:bg-green-700"
                             }`} // Apply dark mode save button styles
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className={`px-6 py-2 rounded-md transition duration-200 text-sm md:text-base
                             ${
                               darkMode
                                 ? "bg-gray-600 text-gray-100 hover:bg-gray-500"
                                 : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                             }`} // Apply dark mode cancel button styles
                >
                  Cancel
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* Placeholder content for other sections */}
          {activeSection === "#food-logging" && (
            <motion.div
              id="food-logging-content"
              className={`p-4 md:p-6 rounded-lg shadow-md transition-colors duration-300
                         ${darkMode ? "bg-gray-700" : "bg-white"}`} // Apply dark mode background
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <h2
                className={`text-lg md:text-xl font-semibold transition-colors duration-300
                             ${darkMode ? "text-gray-200" : "text-gray-700"}`}
              >
                Food Logging Content Goes Here
              </h2>
              <p
                className={`mt-4 text-sm md:text-base transition-colors duration-300
                           ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                This section would contain the interface for logging meals,
                snacks, and drinks.
              </p>
              {/* TODO: Add actual Food Logging components/UI */}
            </motion.div>
          )}

          {activeSection === "#recipe-history" && (
            <motion.div
              id="recipe-history-content"
              className={`p-4 md:p-6 rounded-lg shadow-md transition-colors duration-300
                         ${darkMode ? "bg-gray-700" : "bg-white"}`} // Apply dark mode background
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <h2
                className={`text-lg md:text-xl font-semibold transition-colors duration-300
                             ${darkMode ? "text-gray-200" : "text-gray-700"}`}
              >
                User Recipe History Content Goes Here
              </h2>
              <p
                className={`mt-4 text-sm md:text-base transition-colors duration-300
                           ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                This section would display the recipes the user has created or
                saved.
              </p>
              {/* TODO: Add actual Recipe History components/UI */}
            </motion.div>
          )}
        </div>
      </div>{" "}
      {/* End of flex-1 container */}
    </div>
  )
}

export default ProfilePage
