const validator = require("validator");
const Post = require("../models/Post");

exports.getPost = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("createdBy");

    res.render("index", { title: "Posts", user: req.user, posts });
  } catch (error) {
    console.log({ error });
    return next(error);
  }
};

exports.getAddPost = async (req, res, next) => {
  try {
    res.render("AddPost.ejs", { title: "Add Post", user: req.user });
  } catch (error) {
    return next(error);
  }
};

exports.postAddPost = async (req, res, next) => {
  try {
    const validationErrors = [];
    const { title, description } = req.body;

    if (validator.isEmpty(title))
      validationErrors.push({ msg: "Title cannot be blank." });

    if (validator.isEmpty(description))
      validationErrors.push({ msg: "Description cannot be blank." });

    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      return res.redirect("/addpost");
    }
    await Post.create({
      title,
      description,
      createdBy: req.user._id,
    });
    req.flash("success", [{ msg: "Post Created" }]);

    return res.redirect("/");
  } catch (error) {
    console.log({ error });
    return next(error);
  }
};

exports.likePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (post) {
      let likeBy = post.likeBy.filter(
        (like) => like && like.equals(req.user._id)
      );
      likeBy = likeBy[0];
      if (likeBy) {
        post.meta.likeCount = post.meta.likeCount - 1;
        const newLikeBy = post.likeBy.filter(
          (like) => like && !like.equals(req.user._id)
        );
        post.likeBy = newLikeBy;
      } else {
        post.meta.likeCount = post.meta.likeCount + 1;
        post.likeBy.push(req.user._id);
      }
      await post.save();
    }
    return res.redirect("/");
  } catch (error) {
    return next(error);
  }
};
