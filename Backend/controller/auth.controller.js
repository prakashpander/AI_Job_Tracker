import asyncHandler from "../middleware/asyncHandler.middleware.js";
import ErrorHandler from "../middleware/errorHandler.middleware.js";
import UserModel from "../models/user.model.js";
import User from "../models/user.model.js";
import { validationResult } from "express-validator";
import sendToken from "../utils/jwtToken.js";

export const createUser = asyncHandler(async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = errors.array().map((e) => e.msg).join(", ");
    return next(new ErrorHandler(error, 400))
  }

  if (!req.body || Object.keys(req.body).length == 0) {
    return next(new ErrorHandler("Please fill all details", 400))
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(new ErrorHandler("Please fill all details", 400))
  }

  let checkUser = await UserModel.findOne({ email })

  if (checkUser) {
    console.log("user data = user");
    return next(new ErrorHandler("User already exist.", 400))

  }

  let user = await UserModel.create({ username, email, password });

  sendToken(user, "User Created Successfully.", res, 201);

});

export const loginUser = asyncHandler(async (req, res, next) => {

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = errors.array().map((e) => e.msg).join(', ');
    return next(new ErrorHandler(error, 400))
  }

  if (!req.body || Object.keys(req.body).length == 0) {
    return next(new ErrorHandler("Please fill All Details.", 400));
  }

  const { password, email } = req.body;

  if (!password || !email) {
    return next(new ErrorHandler("Please fill All Details.", 400));
  }


  let user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password!!.", 404));
  }

  let isMatchedPassword = await user.comparePassword(password);

  if (!isMatchedPassword) {
    return next(new ErrorHandler("Invalid email or password!!.", 400));
  }
  sendToken(user, "User logged in successfully.", res, 200);

});

export const logoutUser = asyncHandler(async (req, res, next) => {
  res.clearCookie("userToken");
  return res.status(200).json({
    success: true,
    message: "user logged out successfully."
  })
});

export const editUserProfile = asyncHandler(async (req, res, next) => {

  let error = validationResult(req);

  if (!error.isEmpty()) {
    let errors = error.array().map((e) => e.msg);
    return next(new ErrorHandler(errors, 400));
  };

  if (!req.body || Object.keys(req.body).length == 0) {
    return next(new ErrorHandler("Please fill at least one detail.", 400));
  }

  const {phone, location, expectedSalary, skills, experience}= req.body;
  let data = { phone, location, expectedSalary, skills, experience };

  let userId = req.user._id

  let user = await UserModel.findByIdAndUpdate(
    userId,
    { $set: data },
    {
     returnDocument: 'after',
     runValidators: true
    }
  );

  if (!user) {
  return next(new ErrorHandler("User not found or please login again.", 404));
  }

  return res.status(200).json({
    success: true,
    message: "User Profile Successfully Updated.",
    data
  })
});

export const getUserProfile = asyncHandler(async(req, res, next) => {
  let userId = req.user._id;

  if (!userId) {
    return next(new ErrorHandler("user data not found",404))
  }

  let user = await UserModel.findById(userId);

 return res.status(200).json({
  success : true,
  message : "user data get successfully.",
  user
 });

});