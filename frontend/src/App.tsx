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
import Listing from "./pages/delivery/Listing"
import SharedRecipePage from "./pages/ShareRecipePage"
import CreateListing from "./pages/delivery/createListing"
import Privacy from "./pages/Privacy"
import ChoicePage from "./pages/ChoicePage"
import SearchPage from "./pages/SearchPage"
import SearchStructurePage from "./pages/SearchStructurePage"
import RecipeSearch from "./pages/RecipeSearch"

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
              <Route path="/listing" element={<Listing />} />
              <Route path="/create-listing" element={<CreateListing />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/share/:id" element={<SharedRecipePage />} />
              <Route path="/choice" element={<ChoicePage />} />
              <Route
              path="/search-structure"
              element={<SearchStructurePage />}
              />
              <Route path="/recipe-search" element={<RecipeSearch />} />
              <Route
              path="/search"
              element={
                <SearchPage /> // Uncomment this line when SearchPage is implemented
              }
              />
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
