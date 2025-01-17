import { uploadToCloudinary, deleteFromCloudinary } from "../lib/cloudinary.js";
import Post from "../models/postModel.js";
import Notification from "../models/notificationModel.js";

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: { $in: [...req.user.connections, req.user._id] },
    })
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getFeedPosts controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createPost = async (req, res) => {
  try {
      const { content, media, mediaType } = req.body;

      // Validate input
      if (!content && !media) {
          return res.status(400).json({
              message: "Post must have either content or media"
          });
      }

      let mediaUploadResult = null;
      if (media) {
          mediaUploadResult = await uploadToCloudinary(
              media, 
              'linkedin-posts', 
              mediaType || 'image'
          );
      }

      const newPost = new Post({
          author: req.user._id,
          content,
          media: mediaUploadResult ? {
              url: mediaUploadResult.url,
              publicId: mediaUploadResult.publicId,
              resourceType: mediaUploadResult.resourceType
          } : null
      });

      await newPost.save();
      res.status(201).json(newPost);
  } catch (error) {
      console.error("Post Creation Error:", error);
      res.status(500).json({ message: "Server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
      const post = await Post.findById(req.params.id);

      if (post.media && post.media.publicId) {
          await deleteFromCloudinary(
              post.media.publicId, 
              post.media.resourceType
          );
      }

      await Post.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
      console.error("Post Deletion Error:", error);
      res.status(500).json({ message: "Server error" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture username headline");

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in getPostById controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { user: req.user._id, content } },
      },
      { new: true }
    ).populate("author", "name email username headline profilePicture");

    // create a notification if the comment owner is not the post owner
    if (post.author._id.toString() !== req.user._id.toString()) {
      const newNotification = new Notification({
        recipient: post.author,
        type: "comment",
        relatedUser: req.user._id,
        relatedPost: postId,
      });

      await newNotification.save();
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in createComment controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    const userId = req.user._id;

    if (post.likes.includes(userId)) {
      // unlike the post
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // like the post
      post.likes.push(userId);
      // create a notification if the post owner is not the user who liked
      if (post.author.toString() !== userId.toString()) {
        const newNotification = new Notification({
          recipient: post.author,
          type: "like",
          relatedUser: userId,
          relatedPost: postId,
        });

        await newNotification.save();
      }
    }

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in likePost controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};
