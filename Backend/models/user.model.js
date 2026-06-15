import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ErrorHandler from "../middleware/errorHandler.middleware.js";

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    phone: { 
        type: String,
        default: ""
     },
    location: {
        type: String,
        default: "" 
    },
    expectedSalary: {
        type: String,
        default: "" 
    },
    skills: { 
        type: [String], 
        default: [] 
    },
    experience: { 
        type: String, 
        default: "" 
    },
},
    { timestamps: true });

userSchema.methods.generateAuthToken = function () {
    let token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES })
    return token
};

userSchema.pre("save",
    async function hashedPassword(next) {
        try {
            if (!this.isModified("password")) {
                return
            }
            this.password = await bcrypt.hash(this.password, 10);
            return
        } catch (error) {
            return next(new ErrorHandler("Password Hashing Failed!!", 400));
        }
    })

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const UserModel = mongoose.model("User", userSchema);
export default UserModel;