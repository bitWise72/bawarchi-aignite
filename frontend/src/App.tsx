import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { DarkModeProvider } from "./contexts/DarkModeContext"
import Index from "./pages/Index"
import NotFound from "./pages/NotFound"
import ReviewPost from "./pages/ReviewPost"
import Community from "./pages/Community"
import Login from "./components/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./contexts/AuthContext"
import LandingPage from "./pages/LandingPage"
import AuthCallback from "./components/AuthCallback"
import Terms from "./pages/Terms"
import Privacy from "./pages/Privacy"
const queryClient = new QueryClient()

const App = () => (
  // <GoogleAuthProviderWrapper>
  <QueryClientProvider client={queryClient}>
    <DarkModeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    {/* <Index /> */}
                    <LandingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route path="/home" element={<Index />} />
              <Route path="/review-post" element={<ReviewPost />} />
              <Route path="/community" element={<Community />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </DarkModeProvider>
  </QueryClientProvider>
)

export default App
