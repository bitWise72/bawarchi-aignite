import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import User from "../models/user.js";
import Post from "../models/post.js";

dotenv.config();

const router = express.Router();
router.use(cookieParser());
router.use(express.json());

/** -------------------- Google Auth Routes -------------------- **/

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    if (!req.user) return res.redirect("/");

    const user = req.user;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const encodedToken = encodeURIComponent(token);

    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${encodedToken}&id=${user._id}&name=${encodeURIComponent(
        user.name
      )}&email=${encodeURIComponent(user.email)}&image=${encodeURIComponent(
        user.picture
      )}`
    );
  }
);

/** -------------------- Auth Utilities -------------------- **/

router.get("/me", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Not logged in" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  });
});

/** -------------------- Post Routes -------------------- **/

// Create Post
router.post("/post", async (req, res) => {
  try {
    const { googleId, post } = req.body;
    if (!googleId || !post)
      return res
        .status(400)
        .json({ message: "Google ID and post data are required." });

    const user = await User.findById(googleId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const newPost = new Post({
      userId: user._id,
      name: user.name,
      picture: user.picture,
      posts: post,
      likes: [],
      comments: [],
    });

    await newPost.save();

    user.posts.push(newPost._id);
    await user.save();

    res.status(201).json({ message: "Post created", post: newPost });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// Get posts by current user
// router.post("/yourPosts", async (req, res) => {
//   const { id } = req.body;
//   if (!id) return res.status(400).json({ message: "User ID required." });

//   try {
//     const user = await User.findById(id).populate("posts");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.status(200).json({ posts: user.posts });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch user posts" });
//   }
// });

router.post("/yourPosts", async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "User ID required." });

  try {
    const posts = await Post.find({ userId: new mongoose.Types.ObjectId(id) }).sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user posts" });
  }
});

// Get random posts excluding already seen
router.post("/allPosts", async (req, res) => {
  try {
    const { excludeIds } = req.body;

    const posts = await Post.aggregate([
      {
        $match: {
          _id: {
            $nin: excludeIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
      },
      { $sample: { size: 5 } },
    ]);

    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

/** -------------------- Like / Unlike Post -------------------- **/

router.post("/like", async (req, res) => {
  const { postId, userId } = req.body;

  if (!postId || !userId)
    return res.status(400).json({ message: "postId and userId required" });

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const index = post.likes.findIndex(
      (id) => id.toString() === userId.toString()
    );

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();

    res.status(200).json({
      message: index === -1 ? "Post liked" : "Post unliked",
      likes: post.likes,
    });
  } catch (error) {
    console.error("Like/unlike error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/** -------------------- Add Comment -------------------- **/

router.post("/comment", async (req, res) => {
  const { postId, userId, commentText } = req.body;

  if (!postId || !userId || !commentText)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = {
      userId: new mongoose.Types.ObjectId(userId),
      commentText,
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json({ message: "Comment added", comments: post.comments });
  } catch (error) {
    console.error("Comment error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
