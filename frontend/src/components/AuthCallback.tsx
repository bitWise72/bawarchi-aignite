import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  useEffect(() => {
    const processAuth = () => {
      try {
        // Debug: Log the current URL state
        console.log("Current URL:", window.location.href);
        console.log("Hash:", location.hash);
        console.log("Search:", location.search);

        // Check for auth data in localStorage first
        const existingToken = localStorage.getItem("token");
        const existingUser = localStorage.getItem("user");

        if (existingToken && existingUser) {
          console.log("Using existing auth data");
          setUser(JSON.parse(existingUser));
          navigate("/home");
          return;
        }

        // Extract auth data from URL
        let authParams = new URLSearchParams();
        
        // Check both hash and query parameters
        if (location.hash.includes("auth/callback")) {
          const hashParams = location.hash.split("?")[1] || "";
          authParams = new URLSearchParams(hashParams);
        } else if (location.search) {
          authParams = new URLSearchParams(location.search);
        } else {
          throw new Error("No auth parameters found");
        }

        // Get required values
        const token = authParams.get("token");
        const name = authParams.get("name");
        const email = authParams.get("email");
        const image = authParams.get("image");
        const id = authParams.get("id");

        if (!token || !id) {
          throw new Error("Missing required auth fields");
        }

        // Store auth data
        const userData = { name, email, picture: image, id };
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Update context and redirect
        setUser(userData);
        window.history.replaceState({}, "", "/"); // Clean URL
        navigate("/home");

      } catch (error) {
        console.error("Auth processing failed:", error);
        // Clear any partial auth data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login?error=auth_failed");
      }
    };

    processAuth();
  }, [navigate, setUser, location]);

  return <div>Completing authentication...</div>;
};

export default AuthCallback;