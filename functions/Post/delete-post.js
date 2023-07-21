const jwt = require("jsonwebtoken");
const Post = require("../../models/post");
const User = require("../../models/user");
const { connectToDatabase } = require("../../helpers/db");
const { response, error } = require("../../utils/response");
const { deleteImage } = require("../../utils/clearImage");

// To delete a post
exports.deletePost = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectToDatabase();
    const { id } = event.pathParameters;

    const token = event.headers.Authorization.split(" ")[1];
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    const post = await Post.findById(id);

    if (!post) {
      return response({ statusCode: 404, error: "Post not found." });
    }

    if (userId.toString() !== post.creator._id.toString()) {
      return response({
        statusCode: 403,
        error: "You can't delete someone else's post.",
      });
    }

    await Post.findByIdAndRemove(id);
    await deleteImage(post.imageUrl);

    const user = await User.findById(userId);
    await user.posts.pull(id);
    await user.save();

    return response({
      statusCode: 200,
      message: "post deleted successfully.",
    });
  } catch (err) {
    return error(err.message);
  }
};
