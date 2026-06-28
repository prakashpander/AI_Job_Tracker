import mongoose from "mongoose";

let connectDb = () => {
    mongoose.connect(`${process.env.MONGO_URI} / ${process.env.APP_NAME}`)
        .then(() => {
            console.log("Database Connected Successfully...");
        })
        .catch((error) => {
            console.log("Database Connection Failed = ",error);
        })
}

export default connectDb;