import React, { createContext, useContext, useState, useEffect } from "react"

interface DarkModeContextType {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
)

export const DarkModeProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  // Check system preference initially if no stored preference exists
  const prefersDark =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Check localStorage first (for SSR compatibility)
    if (typeof window !== "undefined") {
      const storedPreference = localStorage.getItem("dark")
      return storedPreference !== null
        ? storedPreference === "true"
        : prefersDark
    }
    return false
  })

  useEffect(() => {
    // Update localStorage
    localStorage.setItem("dark", String(darkMode))

    // Update the HTML class for Tailwind dark mode
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a preference
      if (localStorage.getItem("dark") === null) {
        setDarkMode(e.matches)
      }
    }

    // Some browsers use addEventListener, others use addListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    } else if (mediaQuery.addListener) {
      // @ts-expect-error - For older browsers
      mediaQuery.addListener(handleChange)
      // @ts-expect-error - For older browsers
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [])

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export const useDarkMode = () => {
  const context = useContext(DarkModeContext)
  if (context === undefined) {
    throw new Error("useDarkMode must be used within a DarkModeProvider")
  }
  return context
}
