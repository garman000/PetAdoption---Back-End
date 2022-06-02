import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import HttpError from "../models/http-error.js";
import jwt from "jsonwebtoken";
// import store from "store";

async function signUp(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid input passed, please check again.", 402)
    );
  }
  const { firstname, lastname, email, phonenumber, password, role, isAdmin } =
    req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signup failed, please try again later", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User already exists, try loging in instead",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again!",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    firstname,
    lastname,
    email,
    phonenumber,
    //   "https://www.istockphoto.com/photo/businessman-silhouette-as-avatar-or-default-profile-picture-gm476085198-64396363?utm_source=unsplash&utm_medium=affiliate&utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Favatar&utm_term=avatar%3A%3Asearch-explore-top-affiliate-outside-feed-x-v2%3Ab",
    password: hashedPassword,
    // confirmPassword,
    role,
    isAdmin,
    pets: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
    // return res.status(500).send({message: 'error'})
  }

  let token;
  try {
    token = jwt.sign(
      { user: createdUser.id, email: createdUser.email, password: createdUser.password },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    );
   

  } catch (err) {
    const error = new HttpError("SignUp failed, please try again later", 500);
    return next(error);
  }

  res
    .status(201)
    .json({
      message: "Logged In",
      user: createdUser.toObject({ getters: true}),
      email: createdUser.email,
      token: token,
    });

}
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Log in failed, please try again later", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, was not able to log you in!",
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError("Could not log you in, please try again!", 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Incorrect password, pleaase try again!",
      401
    );
    return next(error);
  }
  delete existingUser.password;


  let token;
  try {
    token = jwt.sign(
      { user: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    );
  } catch (err) {
    const error = new HttpError("Log in failed, please try again later", 500);
    return next(error);
  }

  res.json({
    message: "Logged In",
    user: existingUser.toObject({ getters: true}),
    email: existingUser.email,
    token: token,
  });
  
}

export default { login, signUp };
