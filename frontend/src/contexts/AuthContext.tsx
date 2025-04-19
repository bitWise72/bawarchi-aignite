import React, { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  picture: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => void
  setUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
  setUser: () => {},
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      const token = localStorage.getItem("token")

      console.log("Stored user:", storedUser)
      console.log("Token:", token)

      if (storedUser && token) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
