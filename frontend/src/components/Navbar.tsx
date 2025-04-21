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

    // ✅ Clear ALL stored authentication data
    localStorage.removeItem("token")
    sessionStorage.removeItem("token")
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

    // ✅ Force full page reload to clear session
    window.location.href = "/"
  } catch (error) {
    console.error("Logout failed:", error)
  }
}

const imageLogo = "./logo.png";

const Navbar = ({ darkMode, setDarkMode, name, image }: NavbarProps) => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const userImage = JSON.parse(localStorage.getItem("user") || "{}").picture;

  return (
    <header className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo and Title - Always visible */}
          <div className="flex items-center space-x-3">
            <a href="/">
              <img
                src={imageLogo}
                alt="Bawarchi.AI Logo"
                className="w-16 sm:w-20 object-contain"
              />
            </a>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Bawarchi.AI</h1>
              <p
                className={`text-xs sm:text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Your Personal Kitchen Assistant
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* <button
              className="text-center p-2.5 cursor-pointer lg:font-semibold rounded-lg text-white bg-primary hover:bg-primary-hover transition-colors font-normal"
              onClick={() => navigate("/listing")}
            >
              FoodMart
            </button> */}
            <button
              className="text-center p-2.5 cursor-pointer lg:font-semibold rounded-lg text-white bg-primary hover:bg-primary-hover transition-colors font-normal"
              onClick={() => navigate("/community")}
            >
              Community
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              } transition-colors`}
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
              <DropdownMenuTrigger className="outline-none">
                <img
                  src={
                    userImage ||
                    `./assets/${Math.floor(Math.random() * 8) + 1}.png`
                  }
                  className="h-12 w-12 rounded-full"
                  alt="User"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{name || "User"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem onClick={() => navigate("/profile")}>
                  Profile
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Hamburger Menu */}
          <button
            className="md:hidden p-2"
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
          <div className="md:hidden mt-4 space-y-4 pb-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <img
                  src={
                    userImage ||
                    `./assets/${Math.floor(Math.random() * 8) + 1}.png`
                  }
                  className="h-10 w-10 rounded-full"
                  alt="User"
                />
                <span className="font-medium">{name || "User"}</span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                } transition-colors`}
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>

            <button
              className="w-full text-center p-2.5 cursor-pointer font-semibold rounded-lg text-white bg-primary hover:bg-primary-hover transition-colors"
              onClick={() => {
                navigate("/community")
                setIsMenuOpen(false)
              }}
            >
              Community
            </button>

            {/* <button
              className="w-full text-center p-2.5 cursor-pointer font-semibold rounded-lg text-white bg-primary hover:bg-primary-hover transition-colors"
              onClick={() => {
                navigate("/profile")
                setIsMenuOpen(false)
              }}
            >
              Profile
            </button> */}

            <button
              className="w-full text-center p-2.5 cursor-pointer font-semibold rounded-lg text-white bg-primary hover:bg-primary-hover transition-colors"
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
