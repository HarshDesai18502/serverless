const jwt = require("jsonwebtoken");
const { connectToDatabase } = require("../../helpers/db");
const { updateValidatior } = require("../../validation/userValidator");
const User = require("../../models/user");
const { response, error } = require("../../utils/response");

// To Update a user
exports.updateUser = async (event,context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const token = event.headers.Authorization.split(" ")[1];
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    await connectToDatabase();
    const body = JSON.parse(event.body);

    const isNotValid = updateValidatior(body);
    if (isNotValid) {
      return isNotValid;
    }

    let user = await User.findById(event.pathParameters.id);
    if (!user) {
      return response({ statusCode: 404, error: "User not found." });
    }

    if (user._id.toString() !== userId.toString()) {
      return response({
        statusCode: 403,
        error: "You can't update some other user's info.",
      });
    }

    user = Object.assign(user, body);
    await user.save();

    return response({
      statusCode: 200,
      message: "User updated successfully.",
      data: user,
    });
  } catch (err) {
    return error(err.message);
  } 
};
