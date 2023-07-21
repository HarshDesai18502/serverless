const User = require("../models/user");
const {
  registerUserSchema,
  loginUserSchema,
  updateUserSchema,
} = require("./userSchema");
const { response } = require("../utils/response");

// To check weather the email and userName filed is unique or not
const uniqueFieldChecker = async (body) => {
  const user = await User.findOne({
    $or: [{ userName: body.userName }, { email: body.email }],
  });

  if (user) {
    if (user.email === body.email) {
      return response({
        statusCode: 400,
        message: "Validation Failed",
        error:
          "User with this email already Exist, please choose different email.",
      });
    }

    if (user.userName === body.userName) {
      return response({
        statusCode: 400,
        message: "Validation Failed",
        error:
          "User with this userName already Exist, please choose different userName.",
      });
    }
  }
  return false;
};

// validation when user register
const registerValidatior = (body) => {
  const { error } = registerUserSchema.validate(body);
  if (error) {
    return response({
      statusCode: 400,
      message: "Validation Failed",
      error: error.details,
    });
  }
  return false;
};

// validation while updating
const updateValidatior = (body) => {
  const { error } = updateUserSchema.validate(body);

  if (error) {
    return response({
      statusCode: 400,
      message: "Validation Failed",
      error: error.details,
    });
  }
  return false;
};

// Validation for Login
const loginValidatior = (body) => {
  const { error } = loginUserSchema.validate(body);

  if (error) {
    return response({
      statusCode: 400,
      message: "Validation Failed",
      error: error.details,
    });
  }
  return false;
};

module.exports = {
  registerValidatior,
  updateValidatior,
  uniqueFieldChecker,
  loginValidatior,
};
