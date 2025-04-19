import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const GoogleAuth: React.FC = () => {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_PORT}/auth/google`
  }

  return (
    <button
      onClick={handleLogin}
      className="px-4 py-2 bg-violet-500 text-white rounded"
    >
      Login with Google
    </button>
  )
}

export default GoogleAuth

interface User {
  id: string
  name: string
  email: string
  picture: string
}

// Update setUser to handle token
function setUser(user: User, token: string) {
  localStorage.setItem("token", token)
  // ... handle other user data
}
