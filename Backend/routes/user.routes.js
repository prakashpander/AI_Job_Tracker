import express from "express";
import { body } from "express-validator";
import { createUser, editUserProfile, getUserProfile, loginUser, logoutUser } from "../controller/auth.controller.js";
import { isAuthUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create",[
    body("email").isEmail().withMessage("Enter a valid email address"),
    body("password").isLength({min : 6}).withMessage('Password must be at least 6 chars long'),
    body("username").isLength({min : 3}).withMessage('Password must be at least 3 chars long'),
   ], createUser
);

router.post("/login", [
    body('email').isEmail().withMessage("'Enter a valid email address"),
    body("password").isLength({min : 3}).withMessage('Password must be at least 6 chars long')
], loginUser);

router.put("/update", [
    body('phone').optional().isLength({ min: 10, max: 10 }).withMessage("Phone number must be exactly 10 digits!"),
    body("skills").optional().isArray().withMessage("Skills must be an array!")
],isAuthUser, editUserProfile);

router.get("/getprofile",isAuthUser, getUserProfile)

router.get("/logout", logoutUser)

export default router