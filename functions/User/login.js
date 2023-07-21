const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const { loginValidatior } = require("../../validation/userValidator");
const { connectToDatabase } = require("../../helpers/db");
const { response, error } = require("../../utils/response");

// For Login   -- User can do login either with the email or userName
exports.login = async (event,context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectToDatabase();
    const body = JSON.parse(event.body);

    const isNotValid = loginValidatior(body);
    if (isNotValid) {
      return isNotValid;
    }

    const { email, userName, password } = JSON.parse(event.body);

    const findUser = {};

    if (email) {
      findUser.email = email;
    } else {
      findUser.userName = userName;
    }

    const user = await User.findOne(findUser);

    if (!user) {
      return response({
        statusCode: 401,
        message: "Enter correct email/userName and password.",
        error: "Invalid credentials",
      });
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return response({
        statusCode: 401,
        message: "Enter correct email/userName and password.",
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY_TIME }
    );
    return response({
      statusCode: 200,
      message: "LoggedIn successfully.",
      data: { token, userId: user._id.toString() },
    });
  } catch (err) {
    return error(err.message);
  } 
};
