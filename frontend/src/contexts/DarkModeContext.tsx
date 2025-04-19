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
  const [darkMode, setDarkMode] = useState(localStorage.getItem("dark") === "true")

  useEffect(() => {
    if (darkMode) {
      localStorage.setItem("dark", JSON.stringify(true));
      document.body.classList.add("dark-mode")
    } else {
      localStorage.setItem("dark", JSON.stringify(false));
      document.body.classList.remove("dark-mode")
    }
  }, [darkMode])

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
