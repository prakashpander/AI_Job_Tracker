import express, { urlencoded } from "express";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import applicationRouter from "./routes/application.routes.js";
import aiRouter from "./routes/ai.routes.js"
import { errorMiddleware } from "./middleware/globleError.middleware.js";
import cookieParser from "cookie-parser";

const app = express()
app.use(cors({
    origin: [process.env.FRONTEND_LIVE_URL, process.env.FRONTEND_LOCAL_URL],
    credentials: true
}));
app.use(cookieParser())
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
    console.log("home page");
    res.send("home page")
});

app.use("/api/user", userRouter);
app.use("/api/application", applicationRouter);
app.use("/api/ai", aiRouter);

app.use(errorMiddleware)
export default app