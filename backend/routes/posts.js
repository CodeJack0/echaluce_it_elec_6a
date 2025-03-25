const express = require("express");
const Post = require("../models/post");


const router = express.Router();


// Add Post
router.post("/", async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
    });
    const result = await post.save();
    res.status(201).json({ message: "Post added successfully", postId: result._id });
  } catch (error) {
    res.status(500).json({ message: "Failed to add post", error });
  }
});


// Update Post
router.put("/:id", async (req, res) => {
  try {
    const post = {
      title: req.body.title,
      content: req.body.content,
    };


    const result = await Post.updateOne({ _id: req.params.id }, post);
    if (result.matchedCount > 0) {
      res.status(200).json({ message: "Update Successful!" });
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Updating post failed!", error });
  }
});


// Get All Posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ message: "Posts successfully fetched", posts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
});


// Get Single Post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const result = await Post.deleteOne({ _id: req.params.id });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Post deleted successfully" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Deleting post failed", error });
  }
});


module.exports = router;



