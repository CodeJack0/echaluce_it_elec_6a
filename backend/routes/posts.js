const express = require("express");
const multer = require("multer");
const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    const error = isValid ? null : new Error("Invalid Mime Type");
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("_");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, `${name}-${Date.now()}.${ext}`);
  }
});

const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post(
  "",
  checkAuth,
  upload.single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId
    });

    post.save()
      .then(createdPost => {
        res.status(201).json({
          message: "Post added successfully",
          post: {
            id: createdPost._id,
            title: createdPost.title,
            content: createdPost.content,
            imagePath: createdPost.imagePath
          }
        });
      })
      .catch(error => {
        res.status(500).json({ message: "Couldn't Update Post"  , error });
      });
  }
);

router.put("/:id", checkAuth, upload.single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }

  const post = {
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  };

  Post.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    post
  ).then(result => {
    if (result.nModified > 0) {
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({ message: "Not Authorized!" });
    }
  }).catch(error => {
    res.status(500).json({ message: "Couldn't Update Post"  , error });
  });
});

router.get("/", async (req, res) => {
  try {
    const pageSize = +req.query.pagesize || 10;
    const currentPage = +req.query.page || 1;

    const posts = await Post.find()
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);

    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      message: "Posts successfully fetched",
      posts,
      totalPosts,
    });
  } catch (error) {
    res.status(500).json({ message: "Fetching posts failed", error });
  }
});

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

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Delete successful!" });
      } else {
        res.status(401).json({ message: "Not Authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Deletion Not Done!", error });
    });
});

module.exports = router;
