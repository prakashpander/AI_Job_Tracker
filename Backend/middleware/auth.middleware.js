import UserModel from "../models/user.model.js";
import asyncHandler from "./asyncHandler.middleware.js";
import ErrorHandler from "./errorHandler.middleware.js";
import jwt from "jsonwebtoken";

export const isAuthUser = asyncHandler(async (req, res, next) =>{
try {
    let token =  req.cookies.userToken || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return next(new ErrorHandler("Unauthorized user", 401));
    }
    

    let decode = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decode) {
        return next(new ErrorHandler("user not found!!", 404));
    }

    let user = await UserModel.findById(decode._id);
    
    if (!user) {
        return next(new ErrorHandler("user not found!!", 404));
    }

    req.user = user;

    next();

} catch (error) {

    if ( error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError") {
        return next(new ErrorHandler("Invalid Token !!. Please login again", 401))
    }

    return next(new ErrorHandler("Authentication failed !!", 500))

}
})