const { response } = require("../utils/response");
const { postSchema, postUpdateSchema } = require("./postSchema");

const postValidator = (body) => {
  const { error } = postSchema.validate(body);

  if (error) {
    return response({
      statusCode: 400,
      message: "Validation Failed",
      error: error.details,
    });
  }
  return false;
};

const updatePostValidator = (body) => {
  const { error } = postUpdateSchema.validate(body);

  if (error) {
    return response({
      statusCode: 400,
      message: "Validation Failed",
      error: error.details,
    });
  }
  return false;
};

module.exports = { postValidator, updatePostValidator };
