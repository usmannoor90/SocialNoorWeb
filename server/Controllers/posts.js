import Post from "../models/Post.js";
import User from "../models/user.js";

// create controller

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comment: [],
    });

    await newPost.save();
    const post = await Post.find();

    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
};
// read

export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();

    res.status(201).json(post);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const getUsersPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find(userId);

    res.status(201).json(posts);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = await post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(201).json(updatedPost);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
