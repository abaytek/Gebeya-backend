import Joi from 'joi';
import { User } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { comparePassword, hashPassword } from '../utils/hashPassword.js';

export const registerUser = async (req, res) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(200).required(),
    lastName: Joi.string().min(3).max(200).required(),
    email: Joi.string().required().min(7).max(100).email(),
    password: Joi.string().min(8).max(100).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(error.details[0].message.trim().replaceAll('"', ''));
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json('User already exist');

  user = await new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });

  const hashedPassword = await hashPassword(user.password);
  user.password = hashedPassword;

  await user.save();

  // generate token
  const token = await generateToken(user);
  res.json(token);
};

// LOGIN
export const loginUsers = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().required().min(7).max(100).email(),
    password: Joi.string().min(8).max(100).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(error.details[0].message.trim().replaceAll('"', ''));
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json('User not found ...');

  const isPasswordValid = await comparePassword(
    req.body.password,
    user.password
  );
  if (!isPasswordValid)
    return res.status(400).json('Incorrect email or password');

  // Generate token
  const token = await generateToken(user);
  res.status(200).json(token);
};
