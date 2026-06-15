import { validationResult } from "express-validator";
import asyncHandler from "../middleware/asyncHandler.middleware.js";
import ErrorHandler from "../middleware/errorHandler.middleware.js";
import UserModel from "../models/user.model.js";
import applicationModel from "../models/application.model.js";

export const createApplication = asyncHandler(async (req, res, next) => {

    let error = validationResult(req);

    if (!error.isEmpty()) {
        let errors = error.array().map((e) => e.msg).join(", ");
        return next(new ErrorHandler(errors, 400))
    }

    let { companyName, jobRole, location, expectedSalary, appliedStatus, notes } = req.body;

    if (!companyName || !jobRole || !appliedStatus) {
        return next(new ErrorHandler("Please Fill Mandatory Details.", 400))
    }

    let userId = req.user._id;

    if (!userId) {
        return next(new ErrorHandler("Unauthorized !!", 400))
    }

    let applicationData = await applicationModel.create({
        companyName, jobRole, expectedSalary, location, user: userId, appliedStatus, notes
    });


    return res.status(201).json({
        success: true,
        message: "Application Create Successfully",
        applicationData
    })

});

export const editApplication = asyncHandler(async (req, res, next) => {

    let userId = req.user._id;
    let applicationId = req.params.id;
    console.log("userId => ", userId);
    console.log("applicationId => ", applicationId);


    const { companyName, jobRole, location, appliedStatus, notes } = req.body;

    let updatedData = { companyName, jobRole, location, appliedStatus, notes };

    let application = await applicationModel.findOneAndUpdate(
        { _id: applicationId, user: userId },
        { $set: updatedData },

        {
            returnDocument: "after",
            runValidators: true
        },
    );

    if (!application) {
        return next(new ErrorHandler("Application not found or unauthorized", 404))
    }


    return res.status(200).json({
        success: true,
        message: "Application Updated Successfully.",
        application

    })



});

export const getAllApplication = asyncHandler(async (req, res, next) => {

    let query = { user: req.user._id };

    if (req.query.status) {
        query.appliedStatus = req.query.status;
    }

    if (req.query.search) {
        query.companyName = { $regex: req.query.search, $options: 'i' }
    }

    if (!req.user._id) {
        return next(new ErrorHandler("User Not Found !!, Please Login Again.", 404));
    }

    let applicationData = await applicationModel.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        message: "Fetch User Application Successfully.",
        applications: applicationData.length,
        applicationData
    });

});

export const recentApplications = asyncHandler(async (req, res, next) => {
    let userId = req.user._id
    let applications = await applicationModel.find({ user: userId }).sort({ createdAt: -1 }).limit(5);

    return res.status(200).json({
        success: true,
        message: "Get Recent Applictions Successfully",
        applications
    })

});

export const deleteApplication = asyncHandler(async (req, res, next) => {
    const applicationId = req.params.id;
    const userId = req.user._id;

    const application = await applicationModel.findOneAndDelete({
        _id: applicationId,
        user: userId
    });

    if (!application) {
        return next(new ErrorHandler("Application not found or unauthorized", 404));
    }

    res.status(200).json({
        success: true,
        message: "Application deleted successfully"
    });
});

export const applicationCount = asyncHandler(async (req, res, next) => {
    let user = req.user._id;

    if (!user) {
        return next(new ErrorHandler("Unauthorized User", 400));
    };

    const stats = await applicationModel.aggregate([
        // Step A: Sirf logged-in user ke records filter karo
        { $match: { user: req.user._id } },

        // Step B: appliedStatus ke mutabik group banao aur count jodo
        {
            $group: {
                _id: "$appliedStatus", // Kiske basis par group karna hai
                count: { $sum: 1 }      // Har ek record milne par +1 karte jao
            }
        }
    ]);

    // 2. Database se data kuch aisa aayega: [{_id: "Interview", count: 5}, {_id: "Applied", count: 2}]
    // Isko frontend ke liye thoda saaf aur easy bana lete hain
    const defaultStats = {
        applied: 0,
        interview: 0,
        rejected: 0,
        accepted: 0
    };

    // Jo data DB se aaya use defaultStats me fill kar do
    stats.forEach((item) => {
        // Agar status 'Interview' hai toh use lowercase 'interview' key me daal do
        const statusKey = item._id.toLowerCase();
        if (defaultStats.hasOwnProperty(statusKey)) {
            defaultStats[statusKey] = item.count;
        }
    });

    // 3. Response bhej do
    res.status(200).json({
        success: true,
        stats: defaultStats
    });

});

