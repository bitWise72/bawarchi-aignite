import { useState } from "react"
import { Search } from "lucide-react"

interface RecipeSearchProps {
  onSearch: (query: string) => void
  darkMode: boolean
}

const RecipeSearch = ({ onSearch, darkMode }: RecipeSearchProps) => {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter recipe or search any recipe "
          className={`w-full px-4 py-3 pr-12 text-lg rounded-lg border ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
          } focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-lg hover:bg-primary-hover transition-colors"
          aria-label="Search recipe"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  )
}

export default RecipeSearch
