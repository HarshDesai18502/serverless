const jwt = require("jsonwebtoken");
const Post = require("../../models/post");
const User = require("../../models/user");
const { postValidator } = require("../../validation/postValidator");
const { connectToDatabase } = require("../../helpers/db");
const { response, error } = require("../../utils/response");

// To Create a Post
exports.createPost = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectToDatabase();

    const body = JSON.parse(event.body);

    const token = event.headers.Authorization.split(" ")[1];
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    const isNotValid = postValidator(body);
    if (isNotValid) {
      return isNotValid;
    }

    const post = await Post.create({
      ...body,
      creator: userId,
    });

    const user = await User.findById(userId);
    user.posts.push(post);
    await user.save();

    return response({
      statusCode: 201,
      message: "Post created successfully.",
      data: post,
    });
  } catch (err) {
    return error(err.message);
  }
};
