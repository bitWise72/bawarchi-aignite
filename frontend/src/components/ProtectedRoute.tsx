import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth()

  const token = localStorage.getItem("token")
  const storedUser = localStorage.getItem("user")

  console.log("Protected Route State:", {
    loading,
    hasToken: !!token,
    hasStoredUser: !!storedUser,
    contextUser: user,
  })

  if (loading) return <p>Loading...</p>

  // If no token or user data, redirect to login
  if (!token || !storedUser) {
    console.log("Redirecting to login - missing auth data")
    return <Navigate to="/" />
  }

  // If authenticated, render the protected component
  console.log("Rendering protected content")
  return children
}

export default ProtectedRoute
