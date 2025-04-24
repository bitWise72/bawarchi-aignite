import React from "react"
import { Search, Mic, Camera, ChefHat, TrendingUp } from "lucide-react"
import { useState } from "react"

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Search query:", searchQuery)
    // In a real implementation, you would handle the search here
  }

  // Dummy data for suggested recipes
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

  // Dummy data for trending tags
  const trendingTags = [
    "Quick Dinner",
    "Vegan",
    "Gluten Free",
    "Street Food",
    "Desserts",
    "Instant Pot",
    "Keto",
  ]

  return (
    <>
      <div className="h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex items-center p-4">
              <img src="./logo.png" alt="logo" className="h-14 w-14" />
              <h1 className="text-2xl font-bold ml-2">Bawarchi.AI</h1>
            </div>
            <form onSubmit={handleSubmit} className="w-full max-w-4xl px-4">
              <div className="mx-auto relative flex items-center w-full h-12 rounded-full border border-gray-200 hover:shadow-md focus-within:shadow-md px-4">
                <div className="flex items-center justify-center text-gray-500">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="flex-grow h-full pl-3 pr-2 bg-transparent outline-none text-gray-700"
                  placeholder="Search for recipes, ingredients, or cuisines"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="flex items-center justify-center text-gray-500 hover:text-gray-700"
                  >
                    <span className="text-lg font-thin">×</span>
                  </button>
                )}
                <div className="flex items-center space-x-2 ml-2 text-gray-500">
                  <button type="button" className="p-1 hover:text-blue-500">
                    <Mic size={20} />
                  </button>
                  <button type="button" className="p-1 hover:text-blue-500">
                    <Camera size={20} />
                  </button>
                </div>
              </div>
            </form>

            {/* 80:20 Container for Suggested Recipes and Trending Tags */}
            <div className="w-full max-w-4xl mt-6 px-4 flex">
              {/* Suggested Recipes (80% width) */}
              <div className="w-4/5 pr-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center mb-3 text-gray-700">
                    <ChefHat size={18} className="mr-2" />
                    <h2 className="font-medium">Suggested Recipes</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {suggestedRecipes.map((recipe, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded p-3 hover:bg-gray-100 cursor-pointer"
                      >
                        <p className="text-gray-800">{recipe}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trending Tags (20% width) */}
              <div className="w-1/5">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center mb-3 text-gray-700">
                    <TrendingUp size={18} className="mr-2" />
                    <h2 className="font-medium">Trending</h2>
                  </div>
                  <div className="flex flex-col space-y-2">
                    {trendingTags.map((tag, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded p-2 text-sm hover:bg-gray-100 cursor-pointer"
                      >
                        <p className="text-gray-700">#{tag}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SearchPage
