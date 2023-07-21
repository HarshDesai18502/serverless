const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const { connectToDatabase } = require("../../helpers/db");
const {
  uniqueFieldChecker,
  registerValidatior,
} = require("../../validation/userValidator");
const { response, error } = require("../../utils/response");

// To create a User
exports.registerUser = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectToDatabase();
    const body = JSON.parse(event.body);

    const isNotValid = registerValidatior(body);

    if (isNotValid) {
      return isNotValid;
    }

    const isNotUnique = await uniqueFieldChecker(body);

    if (isNotUnique) {
      return isNotUnique;
    }

    const hashedPw = await bcrypt.hash(body.password, 12);
    const user = await User.create({
      ...body,
      password: hashedPw,
    });

    const reponseObject = {
      name: user.name,
      email: user.email,
      userName: user.userName,
    };
    return response({
      statusCode: 201,
      message: "User Created Successfully.",
      data: reponseObject,
    });
  } catch (err) {
    return error(err.message);
  }
};
