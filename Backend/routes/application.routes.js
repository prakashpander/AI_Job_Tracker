import express from "express";
import { body, ExpressValidator } from "express-validator";
import { applicationCount, createApplication, deleteApplication, editApplication, getAllApplication, recentApplications } from "../controller/application.controller.js";
import { isAuthUser } from "../middleware/auth.middleware.js";

let router = express.Router();

router.post("/create", 
    [
        body("companyName").isLength({min : 1}).withMessage("Company Name Is Required !!."),
        body("jobRole").isLength({min : 1}).withMessage("Job Role Is Required !!.")
    ], 
    isAuthUser, createApplication
);

router.put("/update/:id", isAuthUser, editApplication);

router.get("/getall", isAuthUser ,getAllApplication);

router.get("/recent", isAuthUser ,recentApplications);

// router.delete("/delete", isAuthUser, deleteApplication);
router.delete("/delete/:id", isAuthUser, deleteApplication);

router.get("/count", isAuthUser, applicationCount);

export default router;