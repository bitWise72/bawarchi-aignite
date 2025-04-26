import { Moon, Sun, Menu, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavbarProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  name: string | null
  image: string | null
}

const handleLogout = async () => {
  try {
    await fetch(`${import.meta.env.VITE_BACKEND_PORT}/auth/logout`, {
      method: "GET",
      credentials: "include",
    })

    // Clear ALL stored authentication data
    localStorage.removeItem("token")
    sessionStorage.removeItem("token")
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

    // Force full page reload to clear session
    window.location.href = "/"
  } catch (error) {
    console.error("Logout failed:", error)
  }
}

const imageLogo = "./logo.png"

const Navbar = ({ darkMode, setDarkMode, name, image }: NavbarProps) => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const userImage = JSON.parse(localStorage.getItem("user") || "{}").picture

  return (
    <header
      className={`${
        darkMode ? "bg-oxford-blue-500" : "bg-anti-flash-white-500"
      } shadow-md transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title - Always visible */}
          <div className="flex items-center space-x-3">
            <a href="/" className="transition-opacity hover:opacity-90">
              <img
                src={imageLogo}
                alt="Bawarchi.AI Logo"
                className="w-12 sm:w-16 object-contain"
              />
            </a>

            <div>
              <h1
                className={`text-xl sm:text-2xl font-bold ${
                  darkMode ? "text-snow-500" : "text-gunmetal-500"
                }`}
              >
                Bawarchi.AI
              </h1>
              <p
                className={`text-xs sm:text-sm ${
                  darkMode ? "text-snow-400" : "text-gunmetal-600"
                }`}
              >
                Your Personal Kitchen Assistant
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="text-center px-4 py-2.5 cursor-pointer lg:font-semibold rounded-lg text-white bg-primary hover:bg-primary-hover transition-all duration-300 font-normal shadow-sm hover:shadow"
              onClick={() => navigate("/community")}
            >
              Community
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                darkMode
                  ? "bg-oxford-blue-400 hover:bg-oxford-blue-300 text-snow-500"
                  : "bg-anti-flash-white-400 hover:bg-timberwolf-500 text-gunmetal-500"
              }`}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none ring-primary focus:ring-2 rounded-full transition-transform hover:scale-105">
                <img
                  src={
                    userImage ||
                    `./assets/${Math.floor(Math.random() * 8) + 1}.png`
                  }
                  className="h-12 w-12 rounded-full border-2 border-primary"
                  alt="User"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className={
                  darkMode
                    ? "bg-oxford-blue-350 text-snow-500"
                    : "bg-white text-gunmetal-500"
                }
              >
                <DropdownMenuLabel>{name || "User"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className={`cursor-pointer ${
                    darkMode
                      ? "hover:bg-oxford-blue-400"
                      : "hover:bg-anti-flash-white-400"
                  }`}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Hamburger Menu */}
          <button
            className={`md:hidden p-2 rounded ${
              darkMode
                ? "text-snow-500 hover:bg-oxford-blue-400"
                : "text-gunmetal-500 hover:bg-anti-flash-white-400"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-4 animate-fade-in">
            <div
              className={`flex items-center justify-between py-2 ${
                darkMode ? "text-snow-500" : "text-gunmetal-500"
              }`}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={
                    userImage ||
                    `./assets/${Math.floor(Math.random() * 8) + 1}.png`
                  }
                  className="h-10 w-10 rounded-full border-2 border-primary"
                  alt="User"
                />
                <span className="font-medium">{name || "User"}</span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  darkMode
                    ? "bg-oxford-blue-400 hover:bg-oxford-blue-300 text-snow-500"
                    : "bg-anti-flash-white-400 hover:bg-timberwolf-500 text-gunmetal-500"
                }`}
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>

            <button
              className="w-full text-center p-2.5 cursor-pointer font-semibold rounded-lg text-white bg-primary hover:bg-primary-hover transition-all duration-300 shadow-sm hover:shadow"
              onClick={() => {
                navigate("/community")
                setIsMenuOpen(false)
              }}
            >
              Community
            </button>

            <button
              className="w-full text-center p-2.5 cursor-pointer font-semibold rounded-lg text-white bg-burnt-sienna-500 hover:bg-burnt-sienna-600 transition-all duration-300 shadow-sm hover:shadow"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
