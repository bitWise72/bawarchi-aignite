import express from "express";
import session from "express-session";
import MongoStoreImport from "connect-mongo";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { createRequire } from "module";
import connectDB from "./config/dataBase.js";
import router from "./routes/allRoutes.js";
import "./config/passport.js";

dotenv.config();

// Required for CommonJS packages
const require = createRequire(import.meta.url);
const passport = require("passport");

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

connectDB();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:8080", "https://your-precise-baker-bice.vercel.app"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_default_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStoreImport.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", router);

app.get("/", (req, res) => {
  res.send("Backend is working ✅");
});

export default app;
