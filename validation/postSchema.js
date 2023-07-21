const Joi = require("joi");

const postSchema = Joi.object({
  title: Joi.string().required(),
  imageUrl: Joi.string().required(),
  content: Joi.string().required(),
  location: Joi.string().optional(),
}).options({ abortEarly: false });

const postUpdateSchema = Joi.object({
  title: Joi.string(),
  content: Joi.string(),
  location: Joi.string().optional(),
}).options({ abortEarly: false });

module.exports = { postSchema, postUpdateSchema };
