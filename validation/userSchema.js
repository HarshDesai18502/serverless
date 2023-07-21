const Joi = require("joi");

const registerUserSchema = Joi.object({
  name: Joi.string().min(2).required(),
  userName: Joi.string().alphanum().min(3).required(),
  email: Joi.string().email().required(),
  imageUrl: Joi.string(),
  password: Joi.string().min(8).required(),
  dateOfBirth: Joi.date().min("1900-01-01").max("now").required(),
  status: Joi.string().valid("private", "public").required(),
  description: Joi.string().max(40).optional(),
}).options({ abortEarly: false });

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).optional(),
  imageUrl: Joi.string(),
  password: Joi.string().min(8).optional(),
  dateOfBirth: Joi.date().min("1900-01-01").max("now").optional(),
  status: Joi.string().valid("private", "public").optional(),
  description: Joi.string().max(40).optional(),
}).options({ abortEarly: false });

const loginUserSchema = Joi.object({
  userName: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().required(),
})
  .or("userName", "email")
  .options({ abortEarly: false });

module.exports = { registerUserSchema, updateUserSchema, loginUserSchema };
