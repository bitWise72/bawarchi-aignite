import React, { useEffect, useState, useRef, useCallback, ReactNode, Key } from "react";
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
  ChefHat,
  EyeOff,
  FlaskConical,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { QRCodeSVG } from 'qrcode.react';
import { toBlob } from 'html-to-image';
import { Download, ShoppingBag } from 'lucide-react';
import { toast } from "sonner";

const logo = "./logo.png";

interface RecipeStep {
  step(time: string): React.ReactNode;
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

interface Comment {
  userPicture: string;
  userName: string;
  commentText: string;
  userId: Key;
  authorAvatar?: string;
  id?: string;
  author?: string;
  text?: string;
  timestamp?: string;
}

interface Post {
  _id: string;
  userId: string;
  name: string;
  picture: string;
  createdAt: string;
  posts: PostContent;
  comments?: Comment[];
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
  const [expendedComment, setExpandedComment] = useState<string | null>(null);
  const [bool, setBool] = useState(false);
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
      console.log(data);
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

  const toggleCommentExpansion = (postId: string) => {
    // If we're clicking on the same post that's already expanded
    if (expendedComment === postId) {
      // Closing the comment section - don't fetch comments
      setExpandedComment(null);
    } else {
      // Opening a new comment section - fetch comments
      setExpandedComment(postId);
      fetchComments(postId); // Make sure to pass the postId to your fetch function
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
      // const token = localStorage.getItem("token")

      // console.log("Stored user:", storedUser)
      // console.log("Token:", token)
      // console.log("id: ", storedUser ? JSON.parse(storedUser).id : null);
      setId(storedUser ? JSON.parse(storedUser).id : null);
      setName(storedUser ? JSON.parse(storedUser).name : null);
      setPic(storedUser ? JSON.parse(storedUser).picture : null);
  }, [])
  const [id, setId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [pic, setPic] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [postId, setPostId] = useState<string | null>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  
    // Fetch comments when component mounts or postId changes
    // useEffect(() => {
    //   if (showComments) {
    //     fetchComments();
    //   }
    // }, [ expandedPost]);
  
    const fetchComments = async (postId: string) => {
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_PORT}/auth/fetchComment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postId:postId,
          }),
        });
        
        const data = await response.json();
        console.log(data);
        setComments(data.comments);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    const handleSubmitComment = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newComment.trim()) return;
  
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_PORT}/auth/comment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postId:expendedComment,
            commentText: newComment,
            userId: id,
            userName:name,
            userPicture: pic,
          }),
        });
  
        if (!response.ok) throw new Error('Failed to post comment');
  
        const commentText = await response.json();
        // console.log(commentText);
        setComments(commentText.comments);
        // console.log(comments);
        setNewComment('');
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    const toggleComments = () => {
      setShowComments(!showComments);
      if (!showComments && commentInputRef.current) {
        setTimeout(() => commentInputRef.current?.focus(), 100);
      }
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

  function formatTimeRange(time: string | [string, string]): string {
    if (typeof time === 'string') {
      return `${time} min`;
    }
    return `${time[0]}–${time[1]} min`;
  }

  const renderPost = (post: Post, index: number) => {
    const postContent = post.posts;
    const userInfo = {
      name: post.name || user?.name || "User",
      picture: post.picture || user?.picture || JSON.parse(localStorage.getItem("user") || "{}").picture
    };

    return (
      <div
        key={index}
        className={`rounded-2xl overflow-hidden transition-all duration-300 ${
          darkMode 
            ? "bg-gray-800 border-2 border-yellow-400/20 shadow-lg shadow-yellow-500/10" 
            : "bg-white border-2 border-yellow-300/50 shadow-lg shadow-yellow-300/20"
        } hover:shadow-xl ${darkMode ? "hover:shadow-yellow-500/15" : "hover:shadow-yellow-300/30"} transform hover:-translate-y-1`}
      >
        {/* Post Header - Enhanced Stylish Version */}
        <div className={`p-4 flex items-center justify-between ${
          darkMode ? "bg-gradient-to-r from-yellow-900/30 to-amber-900/20" : "bg-gradient-to-r from-yellow-100 to-amber-50"
        } border-b ${darkMode ? "border-yellow-400/20" : "border-yellow-300/30"}`}>
          <div className="flex items-center space-x-3">
            <div className={`relative ${darkMode ? "ring-2 ring-yellow-400/50" : "ring-2 ring-yellow-500/50"} rounded-full p-0.5`}>
              <div className="relative">
                <img
                  src={userInfo.picture}
                  alt={userInfo.name}
                  className="w-10 h-10 rounded-full object-cover"
                  crossOrigin="anonymous"
                />
                <div className={`absolute inset-0 rounded-full border-2 ${
                  darkMode ? "border-yellow-400/30" : "border-yellow-500/30"
                } animate-pulse`}></div>
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${
                darkMode ? "bg-yellow-400" : "bg-yellow-500"
              } border-2 ${darkMode ? "border-gray-800" : "border-white"} flex items-center justify-center`}>
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="4" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-bold truncate ${
                darkMode ? "text-yellow-300" : "text-yellow-700"
              }`}>
                {userInfo.name}
              </div>
              <div className={`text-xs flex items-center ${
                darkMode ? "text-yellow-400/80" : "text-yellow-600/80"
              }`}>
                <Clock className="w-3 h-3 mr-1" />
                {new Date(postContent.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Images - Ultra Stylish Version */}
        {
        postContent.imageUrl?.[0] && (
          <div className="relative w-full"> {/* Make the container take full width */}
            <div className="relative overflow-hidden rounded-md shadow-md">
              <img
                src={postContent.imageUrl[0]}
                alt={postContent.title}
                className="w-full object-cover transform transition-transform duration-500 hover:scale-105"
                crossOrigin="anonymous"
                style={{ aspectRatio: 'auto' }} 
              />
              {/* Decorative corner elements (keep these) */}
              <div className={`absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 ${
                darkMode ? "border-yellow-400" : "border-yellow-500"
              }`}></div>
              <div className={`absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 ${
                darkMode ? "border-yellow-400" : "border-yellow-500"
              }`}></div>
              <div className={`absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 ${
                darkMode ? "border-yellow-400" : "border-yellow-500"
              }`}></div>
              <div className={`absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 ${
                darkMode ? "border-yellow-400" : "border-yellow-500"
              }`}></div>
            </div>
        
            {/* Floating decorative elements (keep these) */}
            <div className={`absolute top-4 left-4 w-3 h-3 rounded-full ${
              darkMode ? "bg-yellow-400" : "bg-yellow-500"
            } animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
            <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
              darkMode ? "bg-yellow-400" : "bg-yellow-500"
            } animate-bounce`} style={{ animationDelay: '0.3s' }}></div>
            <div className={`absolute bottom-4 left-4 w-3 h-3 rounded-full ${
              darkMode ? "bg-yellow-400" : "bg-yellow-500"
            } animate-bounce`} style={{ animationDelay: '0.5s' }}></div>
            <div className={`absolute bottom-4 right-4 w-3 h-3 rounded-full ${
              darkMode ? "bg-yellow-400" : "bg-yellow-500"
            } animate-bounce`} style={{ animationDelay: '0.7s' }}></div>
          </div>
        )
        }

        {/* Post Basic Content */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <h2 className={`text-xl font-extrabold ${
              darkMode ? "text-yellow-300" : "text-yellow-700"
            }`}>
              {postContent.title}
            </h2>
          </div>
          
          <p className={`text-sm mb-4 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}>
            {postContent.description}
          </p>

          {/* Stylish Tags */}
          {postContent.tags && postContent.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {postContent.tags.map((tag: string, tagIndex: number) => (
                <span
                  key={tagIndex}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    darkMode 
                      ? tagIndex % 2 === 0 
                        ? "bg-yellow-800/60 text-yellow-300 hover:bg-yellow-700/80" 
                        : "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                      : tagIndex % 2 === 0 
                        ? "bg-yellow-300 text-yellow-900 hover:bg-yellow-400" 
                        : "bg-gray-200 text-yellow-800 hover:bg-gray-300"
                  }`}
                >
                  <span className="mr-1">
                    {['🌿', '🍋', '🧄', '🌶️', '🧂', '🍯'][tagIndex % 6]}
                  </span>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Post Actions - Enhanced Stylish Buttons */}
          <div className="mt-4 flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={() => likeHandler(post._id)}
                className={`flex items-center px-4 py-2 rounded-full transition-all ${
                  post.likes?.includes(user?.id || '')
                    ? darkMode 
                      ? "bg-gradient-to-r from-yellow-600 to-amber-600 text-white shadow-lg shadow-yellow-500/20"
                      : "bg-gradient-to-r from-yellow-400 to-amber-400 text-white shadow-lg shadow-yellow-400/30"
                    : darkMode 
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-yellow-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-yellow-700"
                }`}
              >
                <Heart 
                  className="h-5 w-5 mr-1.5" 
                  fill={post.likes?.includes(user?.id || '') ? "currentColor" : "none"}
                />
                <span className="text-sm font-medium">
                  {post.likes?.length || 0}
                </span>
                <span className="hidden sm:inline text-sm font-medium pl-2">Likes</span>
              </button>
              
              <button
                onClick={() => setSharedPost(post)}
                className={`flex items-center px-4 py-2 rounded-full transition-all ${
                  darkMode 
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-yellow-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-yellow-700"
                }`}
              >
                <Share2 className="h-5 w-5 sm:mr-1.5" /> {/* Show margin only on sm+ screens */}
                <span className="hidden sm:inline text-sm font-medium">Share</span> {/* Hide text on small screens */}
              </button>
              <button
                onClick={() => toggleCommentExpansion(post._id)}
                 className={`flex items-center px-4 py-2 rounded-full transition-all ${
                  darkMode 
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-yellow-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-yellow-700"
                }`}
              >
                <MessageCircle className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline text-sm font-medium ">Comment</span> {/* Hide text on small screens */}
              </button>
            </div>

            <button
  onClick={() => togglePostExpansion(index)}
  className={`ml-2 sm:ml-4 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all transform hover:scale-105
    ${
      darkMode
        ? expandedPost === index
          ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900"
          : "bg-gradient-to-r from-yellow-800/70 to-amber-800/70 text-yellow-300"
        : expandedPost === index
          ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-white"
          : "bg-gradient-to-r from-yellow-200 to-amber-200 text-yellow-900"
    }
    shadow-md ${darkMode ? "shadow-yellow-500/10" : "shadow-yellow-500/20"}
  `}
>
  {expandedPost === index ? (
    <>
      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 scale-150 md:scale-100" />
      <span>Hide Alchemy</span>
    </>
  ) : (
    <>
      <ChefHat className="h-4 w-4 sm:h-5 sm:w-5 scale-150 md:scale-100" />
      <span>Show Secrets</span>
    </>
  )}
</button>


          </div>
          
        </div>

        {/* Expanded Recipe Details - Ultra Stylish Version */}
        {expandedPost === index && postContent.recipe && (
          <div className={`border-t ${
            darkMode ? "border-yellow-400/20 bg-gradient-to-b from-gray-800/70 to-gray-900" : "border-yellow-300/30 bg-gradient-to-b from-yellow-50 to-white"
          } p-6`}>
            <div className="flex items-center justify-between mb-8">
              <h3 className={`text-2xl font-extrabold ${
                darkMode ? "text-yellow-300" : "text-yellow-700"
              }`}>
                <span className={`inline-block mr-3 ${darkMode ? "text-yellow-400" : "text-yellow-500"}`}>✨</span>
                Culinary Alchemy Steps
                <span className={`inline-block ml-3 ${darkMode ? "text-yellow-400" : "text-yellow-500"}`}>✨</span>
              </h3>
              {/* <div className={`flex items-center text-sm px-3 py-1.5 rounded-full ${
                darkMode ? "bg-yellow-900/40 text-yellow-300" : "bg-yellow-200 text-yellow-800"
              }`}>
                <Clock className="h-4 w-4 mr-2" />
                <span>Total: {Object.values(postContent.recipe).reduce((acc, step) => acc + (parseInt(step.time || '0', 10)), 0)} mins</span>
              </div> */}
            </div>

            <div className="space-y-8">
              {Object.entries(postContent.recipe).map(
                ([stepKey, step]: [string, RecipeStep], stepIndex) => (
                  <div
                    key={stepKey}
                    className={`relative p-6 rounded-2xl overflow-hidden ${
                      darkMode ? "bg-gray-700/50" : "bg-white"
                    } shadow-lg ${darkMode ? "shadow-yellow-500/10" : "shadow-yellow-300/20"} border-l-4 ${
                      stepIndex % 3 === 0 
                        ? darkMode ? "border-yellow-400" : "border-yellow-500" 
                        : stepIndex % 2 === 0 
                          ? darkMode ? "border-orange-400" : "border-orange-500"
                          : darkMode ? "border-amber-400" : "border-amber-500"
                    }`}
                  >
                    {/* Step decorative elements */}
                    <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold ${
                      darkMode ? "bg-yellow-600/80 text-yellow-100" : "bg-yellow-500/80 text-white"
                    } rounded-bl-xl rounded-tr-lg`}>
                      Step {stepIndex + 1}
                    </div>
                    
                    <div className="flex items-start">
                      <div className={`mr-5 text-3xl ${
                        stepIndex % 3 === 0 
                          ? darkMode ? "text-yellow-400" : "text-yellow-500" 
                          : stepIndex % 2 === 0 
                            ? darkMode ? "text-orange-400" : "text-orange-500"
                            : darkMode ? "text-amber-400" : "text-amber-500"
                      }`}>
                        {['🥣', '🍲', '🔥', '🧫'][stepIndex % 4]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className={`font-bold text-lg ${
                            darkMode ? "text-yellow-300" : "text-yellow-700"
                          }`}>
                            {step.procedure.split('.')[0]}
                          </h4>
                          {step.time && (
                            <div className={`flex items-center text-xs px-3 py-1 rounded-full ${
                              darkMode ? "bg-yellow-900/40 text-yellow-300" : "bg-yellow-200 text-yellow-800"
                            }`}>
                              <Clock className="h-3 w-3 mr-2" />
                              {/* <span>{step.time} min</span> */}
                              <span>{formatTimeRange(step.time)}</span>
                            </div>
                          )}
                        </div>

                        <p className={`mb-5 text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}>
                          {step.procedure}
                        </p>

                        {step.measurements && step.measurements.length > 0 && (
                          <div className="mt-5">
                            <h5 className={`text-sm font-bold mb-4 flex items-center ${
                              darkMode ? "text-yellow-400" : "text-yellow-600"
                            }`}>
                              <FlaskConical className="h-5 w-5 mr-3" />
                              Alchemical Ingredients:
                            </h5>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {step.measurements.map(
                                ([ingredient, quantity]: [string, string], ingIndex: number) => (
                                  <li key={ingIndex} className="flex items-start">
                                    <span className={`mt-1 mr-3 flex-shrink-0 inline-block w-3 h-3 rounded-full ${
                                      darkMode 
                                        ? ingIndex % 3 === 0 
                                          ? "bg-yellow-400" 
                                          : ingIndex % 2 === 0 
                                            ? "bg-orange-400" 
                                            : "bg-amber-400"
                                        : ingIndex % 3 === 0 
                                          ? "bg-yellow-500" 
                                          : ingIndex % 2 === 0 
                                            ? "bg-orange-500" 
                                            : "bg-amber-500"
                                    }`}></span>
                                    <div className="flex-1">
                                      <span className={`font-medium ${
                                        darkMode ? "text-yellow-300" : "text-yellow-700"
                                      }`}>{ingredient}</span>
                                      <span className={`mx-3 ${
                                        darkMode ? "text-gray-500" : "text-gray-400"
                                      }`}>-</span>
                                      <span className={`${
                                        darkMode ? "text-gray-300" : "text-gray-600"
                                      }`}>{quantity}</span>
                                    </div>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Stylish Footer */}
            <div className={`mt-8 p-5 rounded-2xl text-center ${
              darkMode ? "bg-gradient-to-r from-yellow-900/30 to-amber-900/20 text-yellow-300" : "bg-gradient-to-r from-yellow-100 to-amber-50 text-yellow-800"
            } border ${darkMode ? "border-yellow-400/20" : "border-yellow-300/30"}`}>
              <div className="text-lg font-bold mb-2 flex items-center justify-center">
                <span className="mr-3">✨</span>
                Chef's Wisdom
                <span className="ml-3">✨</span>
              </div>
              <div className="text-sm italic">
                {[
                  "Great cooking is about following your heart and your instincts.",
                  "The secret of success in the kitchen is to taste everything.",
                  "Cooking is an art, but all art requires knowing something about the techniques.",
                  "A recipe has no soul. You, as the cook, must bring soul to the recipe.",
                  "Food is our common ground, a universal experience."
                ][Math.floor(Math.random() * 5)]}
              </div>
            </div>
          </div>
        )}
        {/*  */}
        {expendedComment === post._id && (
  <div className={`mt-4 border-t ${
    darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
  } p-4`}>
    {/* Comments List */}
    <div className="mb-4">
      <h3 className={`text-lg font-bold mb-3 ${
        darkMode ? 'text-yellow-300' : 'text-yellow-700'
      }`}>
        Comments ({comments.length || 0})
      </h3>
      
      <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
        {isLoading && !comments.length ? (
          <div className="flex justify-center py-4">
            <div className={`animate-spin rounded-full h-6 w-6 border-b-2 ${
              darkMode ? 'border-yellow-400' : 'border-yellow-500'
            }`}></div>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.userId} className={`flex items-start p-4 rounded-lg mb-3 ${
              darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-white border-gray-200'
            } border`}>
              {/* User Avatar - You'll need to fetch user details separately */}
              <div className="relative mr-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <img src={comment.userPicture} alt={comment.userName} className="w-full h-full rounded-full object-cover" crossOrigin="anonymous" />
                </div>
              </div>
          
              {/* Comment Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  {/* User Name - You'll need to fetch this separately */}
                  <span className={`font-medium ${
                    darkMode ? 'text-yellow-300' : 'text-yellow-600'
                  }`}>
                    {comment.userName}
                  </span>
                  
                  {/* Timestamp - Add if available in your data */}
                  {/* <span className={`text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {comment.timestamp ? new Date(comment.timestamp).toLocaleString() : 'Just now'}
                  </span> */}
                </div>
          
                {/* Comment Text */}
                <p className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {comment.commentText}
                </p>
          
                {/* Optional: Comment Actions */}
                {/* <div className="flex items-center mt-2 space-x-4">
                  <button className={`text-xs ${
                    darkMode ? 'text-gray-400 hover:text-yellow-300' : 'text-gray-500 hover:text-yellow-600'
                  }`}>
                    Like
                  </button>
                  <button className={`text-xs ${
                    darkMode ? 'text-gray-400 hover:text-yellow-300' : 'text-gray-500 hover:text-yellow-600'
                  }`}>
                    Reply
                  </button>
                </div> */}
              </div>
            </div>
          ))
        ) : (
          <p className={`text-center py-4 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>

    {/* Comment Input Area */}
    <div className="mt-4">
      <div className="flex items-start space-x-3">
        <img
          src={user?.picture || ''}
          alt={user?.name || 'User'}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1">
          <textarea
            ref={commentInputRef}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            rows={3}
            className={`w-full px-4 py-3 rounded-xl text-sm mb-2 ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
            } border focus:outline-none focus:ring-2 ${
              darkMode ? 'focus:ring-yellow-500' : 'focus:ring-yellow-400'
            } resize-none`}
            disabled={isLoading}
          />
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setExpandedComment(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isLoading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                darkMode
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
              } ${
                (!newComment.trim() || isLoading) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting...
                </span>
              ) : (
                'Post Comment'
              )}
            </button>
          </div>
        </div>
      </div>
      
      {error && (
        <p className={`mt-2 text-xs text-center ${
          darkMode ? 'text-red-400' : 'text-red-600'
        }`}>
          {error}
        </p>
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
    console.log(post);
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
      <div className="relative min-w-[300px] bg-amber-400">
        <div
          ref={postCardRef}
          className={`relative w-full max-h-96 max-w-md aspect-[4/5] rounded-2xl overflow-hidden transition-all duration-300 shadow-xl shadow-gray-900/50 `}
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
                    value={`${window.location.origin}/share/${post._id}`}
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
              ? 'bg-amber-800 hover:bg-amber-900 text-white shadow-indigo-900/50'
              : 'bg-amber-900 hover:bg-amber-950 text-white shadow-indigo-200/50'
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
              <div className={`relative max-w-2xl ${darkMode ? 'bg-gray-800' : 'bg-amber-400'} rounded-lg p-6`}>
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