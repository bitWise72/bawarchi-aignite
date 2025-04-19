import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Users,
  Clock,
  ChevronDown,
  ChevronUp,
  Tag,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { QRCodeSVG } from 'qrcode.react';
import { toBlob } from 'html-to-image';
import { Download } from 'lucide-react';
import { toast } from "sonner";

const logo = "./logo.png";

interface RecipeStep {
  procedure: string;
  time: string;
  measurements: [string, string][];
}

interface Recipe {
  [key: string]: RecipeStep;
}

interface PostContent {
  _id: string;
  title: string;
  description: string;
  imageUrl: string[];
  recipe: Recipe;
  tags: string[];
  createdAt: string;
}

interface Post {
  _id: string;
  userId: string;
  name: string;
  picture: string;
  createdAt: string;
  posts: PostContent;
  comments?: any[];
  likes?: any[];
  __v?: number;
}

interface UserData {
  googleId: string;
  name: string;
  email: string;
  picture: string;
  posts: Post[];
}

const Community = () => {
  const { darkMode, setDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState<"trending" | "following">("following");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState({
    userPosts: true,
    trendingPosts: true
  });
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [user, setUser] = useState<{
    picture: string;
    name: string;
    email: string;
    image: string;
    id: string;
  } | null>(null);
  const [loadedPostIds, setLoadedPostIds] = useState<string[]>([]);
  const [sharedPost, setSharedPost] = useState<Post | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useRef<HTMLDivElement>(null);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user.id) return;

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_PORT}/auth/yourPosts`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: user.id }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const normalizedPosts = data.posts.map((post: any) => ({
          ...post,
          posts: {
            ...post.posts,
            imageUrl: Array.isArray(post.posts?.imageUrl) ? post.posts.imageUrl : [],
          }
        }));
        
        setUserData({ ...data, posts: normalizedPosts });
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setLoading(prev => ({ ...prev, userPosts: false }));
      }
    };

    fetchUserPosts();
  }, []);

  const likeHandler = async (postId: any) => {
    const storedUser = localStorage.getItem("user");
  if (!storedUser) return toast.error("You must be logged in");

  const userId = JSON.parse(storedUser).id;

  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_PORT}/auth/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, userId }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Failed to like post");
      return;
    }

    // Success
    toast.success(data.message);

    // Optionally update your state here:
    // - If you're maintaining local post state, update likes array
    // - Re-fetch posts if needed

    // Update the posts state to reflect the like change
    if (activeTab === "trending") {
      setTrendingPosts(prevPosts => 
        prevPosts.map(post => {
          if (post._id === postId) {
            // Toggle like status for this user
            const isLiked = post.likes?.includes(userId);
            return {
              ...post,
              likes: isLiked 
                ? post.likes?.filter(id => id !== userId) // Remove like
                : [...(post.likes || []), userId] // Add like
            };
          }
          return post;
        })
      );
    } else {
      setUserData(prevData => {
        if (!prevData) return null;
        return {
          ...prevData,
          posts: prevData.posts.map(post => {
            if (post._id === postId) {
              // Toggle like status for this user
              const isLiked = post.likes?.includes(userId);
              return {
                ...post,
                likes: isLiked 
                  ? post.likes?.filter(id => id !== userId) // Remove like
                  : [...(post.likes || []), userId] // Add like
              };
            }
            return post;
          })
        };
      });
    }
  } catch (error) {
    console.error("Like error:", error);
    toast.error("Something went wrong");
  }
  }

  const fetchTrendingPosts = useCallback(async (isInitialLoad = false) => {
    if ((loadingMore && !isInitialLoad) || !hasMorePosts) return;
    
    setLoadingMore(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_PORT}/auth/allPosts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ excludeIds: loadedPostIds }),
        }
      );
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const data = await response.json();
      
      if (data.posts.length === 0) {
        setHasMorePosts(false);
      } else {
        const normalizedPosts = data.posts.map((post: any) => ({
          ...post,
          posts: {
            ...post.posts,
            imageUrl: Array.isArray(post.posts?.imageUrl) ? post.posts.imageUrl : [],
          }
        }));
        
        setTrendingPosts(prevPosts => [...prevPosts, ...normalizedPosts]);
        setLoadedPostIds(prevIds => [...prevIds, ...data.posts.map((post: Post) => post._id)]);
      }
    } catch (error) {
      console.error("Error fetching trending posts:", error);
    } finally {
      setLoadingMore(false);
      if (isInitialLoad) initialLoadDone.current = true;
    }
  }, [loadedPostIds, loadingMore, hasMorePosts]);

  useEffect(() => {
    if (loading.trendingPosts || !hasMorePosts) return;
  
    if (observer.current) observer.current.disconnect();
  
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchTrendingPosts();
      }
    });
  
    if (lastPostRef.current) {
      observer.current.observe(lastPostRef.current);
    }
  
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading.trendingPosts, hasMorePosts, fetchTrendingPosts]);

  const togglePostExpansion = (index: number) => {
    setExpandedPost(expandedPost === index ? null : index);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
        !loadingMore &&
        hasMorePosts
      ) {
        fetchTrendingPosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMorePosts, loadedPostIds, fetchTrendingPosts]);

  useEffect(() => {
    if (activeTab === "trending" && !initialLoadDone.current) {
      fetchTrendingPosts(true);
    }
  }, [activeTab, fetchTrendingPosts]);

  const renderPost = (post: Post, index: number) => {
    const postContent = post.posts;
    const userInfo = {
      name: post.name || user?.name || "User",
      picture: post.picture || user?.picture || JSON.parse(localStorage.getItem("user") || "{}").picture
    };

    return (
      <div
        key={index}
        className={`rounded-lg ${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow overflow-hidden`}
      >
        {/* Post Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={userInfo.picture}
              alt={userInfo.name}
              className="w-10 h-10 rounded-full object-cover"
              crossOrigin="anonymous"
            />
            <div className="ml-3">
              <div className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                {userInfo.name}
              </div>
              <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {new Date(postContent.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Images */}
        {postContent.imageUrl?.[0] && (
          <img
            src={postContent.imageUrl[0]}
            alt={postContent.title}
            className="w-full aspect-video object-cover"
            crossOrigin="anonymous"
          />
        )}

        {/* Post Basic Content */}
        <div className="p-4">
          <h2 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
            {postContent.title}
          </h2>
          <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            {postContent.description}
          </p>

          {/* Tags */}
          {postContent.tags && postContent.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {postContent.tags.map((tag: string, tagIndex: number) => (
                <span
                  key={tagIndex}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    darkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Post Actions */}
          <div className="mt-4 flex justify-between items-center">
            <div className="flex space-x-4">
            <button
            onClick={() => likeHandler(post._id)}
            className={`flex items-center ${
              darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Heart 
              className="h-5 w-5 mr-1" 
              fill={post.likes?.includes(user?.id || '') ? "red" : "none"}
              color={post.likes?.includes(user?.id || '') ? "#ef4444" : "currentColor"} // Red if liked
            />
            <span className="text-sm">
              {post.likes?.length || 0} {/* Show like count */}
            </span>
          </button>
              {/* <button
                className={`flex items-center ${
                  darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <MessageCircle className="h-5 w-5 mr-1" />
                <span className="text-sm">Comment</span>
              </button> */}
              <button
                onClick={() => setSharedPost(post)}
                className={`flex items-center ${
                  darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Share2 className="h-5 w-5 mr-1" />
                <span className="text-sm">Share</span>
              </button>
            </div>

            <button
              onClick={() => togglePostExpansion(index)}
              className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
            >
              {expandedPost === index ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Hide Recipe
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  View Recipe
                </>
              )}
            </button>
          </div>
        </div>

        {/* Expanded Recipe Details */}
        {expandedPost === index && postContent.recipe && (
          <div className={`border-t ${darkMode ? "border-gray-700" : "border-gray-200"} p-4`}>
            <h3 className={`text-lg font-medium mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Recipe Steps
            </h3>

            <div className="space-y-6">
              {Object.entries(postContent.recipe).map(
                ([stepKey, step]: [string, RecipeStep], stepIndex) => (
                  <div
                    key={stepKey}
                    className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                        Step {stepIndex + 1}
                      </h4>
                      {step.time && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{step.time} min</span>
                        </div>
                      )}
                    </div>

                    <p className={`mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {step.procedure}
                    </p>

                    {step.measurements && step.measurements.length > 0 && (
                      <div className="mt-3">
                        <h5 className={`text-sm font-medium mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}>
                          Ingredients for this step:
                        </h5>
                        <ul className={`grid grid-cols-1 sm:grid-cols-2 gap-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}>
                          {step.measurements.map(
                            ([ingredient, quantity]: [string, string], ingIndex: number) => (
                              <li key={ingIndex} className="flex items-center">
                                <span
                                  className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                    darkMode ? "bg-primary/60" : "bg-primary/40"
                                  }`}
                                ></span>
                                <span className="font-medium">{ingredient}</span>
                                <span className="mx-2">-</span>
                                <span>{quantity}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const ShareablePostCard = ({ post, darkMode }: { post: Post; darkMode: boolean }) => {
    const postCardRef = useRef<HTMLDivElement>(null);
    const [downloadReady, setDownloadReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const postContent = post.posts;
    const imageUrl = postContent.imageUrl?.[0]?.includes('res.cloudinary.com')
      ? postContent.imageUrl[0]
      : `https://res.cloudinary.com/dv28lfhwr/image/upload/w_1200,h_800,c_fill/${postContent.imageUrl?.[0]}`;

    const handleDownload = async () => {
      if (!postCardRef.current) return;
  
      try {
        setError(null);
        
        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.src = imageUrl;
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Image failed to load'));
        });
  
        const blob = await toBlob(postCardRef.current, {
          quality: 1,
          pixelRatio: 2,
          cacheBust: true,
          skipFonts: true,
          fetchRequestInit: { mode: 'cors' }
        });
  
        if (blob) {
          const link = document.createElement('a');
          link.download = `${postContent.title.replace(/[^a-z0-9]/gi, '_')}_recipe.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
        }
      } catch (err) {
        console.error('Download failed:', err);
        setError('Failed to generate image. Please try again.');
      }
    };
  
    return (
      <div className="relative min-w-[300px]">
        <div
          ref={postCardRef}
          className={`relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden transition-all duration-300 shadow-xl shadow-gray-900/50`}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={postContent.title}
              className="absolute inset-0 w-full h-full object-cover"
              crossOrigin="anonymous"
              onLoad={() => setDownloadReady(true)}
              onError={() => {
                setError('Failed to load recipe image');
                setDownloadReady(false);
              }}
            />
          ) : (
            <div className={`absolute inset-0 w-full h-full flex items-center justify-center bg-gray-800`}>
              <span className={`text-lg text-gray-400`}>No Image</span>
            </div>
          )}
  
          <div className={`absolute inset-0 bg-black/40`}></div>
  
          <div className="relative h-full flex flex-col justify-between p-6">
            <div>
              <h3 className={`text-3xl font-bold mb-2 leading-tight text-white`}>
                {postContent.title}
              </h3>
              
              {postContent.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {postContent.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`text-xs px-3 py-1 rounded-full backdrop-blur-sm bg-black/40 text-gray-200 border border-gray-600/50`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
  
            <div className="flex justify-between items-end">
              <div className={`text-sm absolute left-2 bottom-2 text-gray-300/90`}>
                @YourPreciseBaker
              </div>
  
              <div className={`p-2.5 rounded-xl absolute right-2 bottom-2 backdrop-blur-lg bg-black/50 border border-gray-600/50 shadow-lg`}>
                <div className="flex flex-col items-center">
                  <QRCodeSVG
                    value={`${window.location.origin}/recipe/${postContent._id}`}
                    size={80}
                    level="H"
                    bgColor='rgba(0, 0, 0, 0.5)'
                    fgColor='#f3f4f6'
                  />
                  <p className={`text-xs text-center mt-1.5 text-gray-200`}>Scan for recipe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <button
          onClick={handleDownload}
          disabled={!downloadReady}
          className={`mt-5 flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 ${
            darkMode
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-900/50'
              : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-200/50'
          } ${
            !downloadReady ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'
          }`}
        >
          <Download size={18} className="shrink-0" />
          <span className="font-medium">
            {downloadReady ? 'Download Postcard' : 'Preparing...'}
          </span>
        </button>
  
        {error && (
          <div className={`mt-3 text-sm px-3 py-2 rounded-lg ${
            darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'
          }`}>
            {error}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        name={user?.name || ""}
        image={user?.image || ""}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Sidebar - User Profile */}
          <div className="md:col-span-1 lg:col-span-3">
            {user ? (
              <div
                className={`rounded-lg overflow-hidden ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } shadow sticky top-20`}
              >
                <div className="h-36 bg-gradient-to-r from-primary to-blue-500 relative">
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <img
                      src={user.picture}
                      alt={user.name}
                      crossOrigin="anonymous"
                      className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-md"
                    />
                  </div>
                </div>

                <div className="px-6 pb-6 pt-16 text-center">
                  <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {user.name}
                  </h2>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
                    {user.email}
                  </p>

                  <div className="mt-4 flex justify-center space-x-8">
                    <div className="text-center">
                      <div className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {userData?.posts.length || 0}
                      </div>
                      <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Posts
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        0
                      </div>
                      <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Followers
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`rounded-lg p-10 ${darkMode ? "bg-gray-800" : "bg-white"} shadow`}>
                <div className="animate-pulse flex flex-col items-center">
                  <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-24 w-24"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mt-6"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mt-3"></div>
                  <div className="flex justify-center space-x-8 mt-6">
                    <div className="text-center">
                      <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16 mt-1"></div>
                    </div>
                    <div className="text-center">
                      <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16 mt-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content - Recipe Feed */}
          <div className="md:col-span-2 lg:col-span-6 space-y-6">
            {/* Feed Tabs */}
            <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("trending")}
                className={`pb-4 px-2 text-sm font-medium ${
                  activeTab === "trending"
                    ? "border-b-2 border-primary text-primary"
                    : darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                <TrendingUp className="h-5 w-5 inline mr-2" />
                For You
              </button>
              <button
                onClick={() => setActiveTab("following")}
                className={`pb-4 px-2 text-sm font-medium ${
                  activeTab === "following"
                    ? "border-b-2 border-primary text-primary"
                    : darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                <Users className="h-5 w-5 inline mr-2" />
                Your Posts
              </button>
            </div>

            {/* Display Content Based on Active Tab */}
            {activeTab === "trending" ? (
              <>
                {trendingPosts.map((post, index) => (
                  <div 
                    key={index} 
                    ref={index === trendingPosts.length - 1 ? lastPostRef : null}
                  >
                    {renderPost(post, index)}
                  </div>
                ))}
                
                {loadingMore && (
                  <div className="flex justify-center my-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                )}
                
                {!hasMorePosts && trendingPosts.length > 0 && (
                  <div className={`text-center py-4 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                    No more posts to load
                  </div>
                )}
              </>
            ) : (
              <>
                {loading.userPosts ? (
                  <div className="space-y-6">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className={`rounded-lg ${
                          darkMode ? "bg-gray-800" : "bg-white"
                        } shadow p-4 animate-pulse`}
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/6 mt-2"></div>
                          </div>
                        </div>
                        <div className="h-48 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                        <div className="mt-4">
                          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mt-2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : userData?.posts.length ? (
                  userData.posts.map((post, index) => renderPost(post, index))
                ) : (
                  <div
                    className={`text-center py-12 rounded-lg ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    } shadow`}
                  >
                    <Users className="h-12 w-12 mx-auto text-gray-400" />
                    <p
                      className={`mt-4 text-lg font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      No posts yet
                    </p>
                    <p
                      className={`mt-2 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Your recipe posts will appear here
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right sidebar - Popular Tags */}
          <div className="md:col-span-3 lg:col-span-3">
            <div
              className={`rounded-lg p-6 ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow sticky top-20`}
            >
              <h3
                className={`text-lg font-medium mb-4 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "healthy",
                  "quick meals",
                  "vegetarian",
                  "dessert",
                  "breakfast",
                  "dinner",
                ].map((tag, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      darkMode
                        ? "bg-gray-700 text-gray-200"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Trending recipes section */}
            <div
              className={`rounded-lg p-6 ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow mt-6`}
            >
              <h3
                className={`text-lg font-medium mb-4 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Trending Recipes
              </h3>
              <div className="space-y-4">
                {[
                  "Garlic Butter Shrimp Pasta",
                  "Chocolate Lava Cake",
                  "Avocado Toast",
                ].map((recipe, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 py-2 ${
                      i < 2 ? "border-b" : ""
                    } ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <span
                        className={darkMode ? "text-white" : "text-gray-900"}
                      >
                        {i + 1}
                      </span>
                    </div>
                    <span
                      className={darkMode ? "text-gray-300" : "text-gray-700"}
                    >
                      {recipe}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {sharedPost && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className={`relative max-w-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
                <button 
                  onClick={() => setSharedPost(null)}
                  className="absolute top-3 right-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <ShareablePostCard post={sharedPost} darkMode={darkMode} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;