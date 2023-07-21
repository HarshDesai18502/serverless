const jwt = require("jsonwebtoken");
const Post = require("../../models/post");
const { updatePostValidator } = require("../../validation/postValidator");
const { connectToDatabase } = require("../../helpers/db");
const { response, error } = require("../../utils/response");

exports.updatePost = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectToDatabase();
    const body = JSON.parse(event.body);

    const isNotValid = updatePostValidator(body);
    if (isNotValid) {
      return isNotValid;
    }

    const token = event.headers.Authorization.split(" ")[1];
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    const { id } = event.pathParameters;

    const post = await Post.findById(id);

    if (!post) {
      return response({ statusCode: 404, error: "Post not found." });
    }

    if (userId.toString() !== post.creator._id.toString()) {
      return response({
        statusCode: 403,
        error: "You can't update someone else's post.",
      });
    }

    Object.assign(post, body);
    await post.save();

    return response({
      statusCode: 200,
      message: "post updated successfully.",
      data: post,
    });
  } catch (err) {
    return error(err.message);
  }
};
