import User from "../models/userModel.js";
import "dotenv/config";
import HttpError from "../models/http-error.js";
import { validationResult } from "express-validator";

const getUserById = async (req, res, next) => {
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError('Couldnt find user by id', 500)
    return next(error)
  }

  if (!user) {
    const error = new HttpError('Couldnt find user with provided id', 404)
    return next(error);
  }

  res.json({user: user.toObject({ getters: true})})
};


const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};
const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data!", 422)
    );
  }

  const { firstname, lastname, email, bio, phonenumber } = req.body;
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findByIdAndUpdate(userId, {
      firstname,
      lastname,
      email,
      bio,
      phonenumber,
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user",
      500
    );
    return next(error);
  }

  res
    .status(200)
    .json({
      user: user.toObject({ getters: true }),
      message: "users been updated",
    });
};

export default { getUsers, getUserById, updateUser };
