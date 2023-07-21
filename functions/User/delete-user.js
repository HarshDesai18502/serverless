const jwt = require("jsonwebtoken");
const Post = require("../../models/post");
const User = require("../../models/user");
const { connectToDatabase } = require("../../helpers/db");
const { response, error } = require("../../utils/response");

exports.deleteUser = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const token = event.headers.Authorization.split(" ")[1];
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    await connectToDatabase();

    const { id } = event.pathParameters;
    const user = await User.findById(id);
    if (!user) {
      return response({ statusCode: 404, error: "User not found." });
    }

    if (user._id.toString() !== userId.toString()) {
      return response({
        statusCode: 403,
        error: "You can't delete other user.",
      });
    }

    await Post.deleteMany({ creator: id });

    await User.findByIdAndDelete(id);
    return response({ statusCode: 200, message: "User Deleted Successfully" });
  } catch (err) {
    return error(err.message);
  }
};
