import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import multer from "multer";
import helmet from "helmet";
import path from "path";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { createPost } from "./Controllers/posts.js";
import { fileURLToPath } from "url";
import { register } from "./Controllers/auth.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/user.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";
// middleware Configuration for my app
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
// middleware Configuration for my app
// file stroage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// routes
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);
// routes with auth
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
// file stroage configuration
const PORT = process.env.PORT || 9000;

mongoose
  .connect("mongodb://0.0.0.0:27016/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `connected to MongoDB and Listening to backend at port ${PORT}`
      );
    });
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((err) => {
    console.log("could not connected to mongoDB", err);
  });
