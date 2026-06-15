import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    companyName : {
        type : String,
        required : true,
        trim: true
    },
    jobRole : {
        type : String,
        required : true,
        trim: true
    },
    location : {
        type : String,
        trim: true
    },
    expectedSalary : {
        type : String,
        trim: true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    appliedStatus : { 
        type : String,
        required : true,
        enum : ["Interview", "Shortlisted", "Offer", "Rejected", "Applied"],
        default : "Applied"
    },
    notes : {
        type : String,
        trim: true
    }
},
{timestamps : true}
);

const applicationModel = mongoose.model("Application", applicationSchema);

export default applicationModel;