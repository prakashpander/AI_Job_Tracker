import dotenv from "dotenv"
dotenv.config();
import app from "./app.js";
import connectDb from "./config/db.js";

connectDb()
let PORT = process.env.PORT || process.env.LIVE_PORT || process.env.LOCAL_PORT

app.listen(PORT, () => {
    console.log(`Server run on PORT ${PORT} http://localhost:${PORT}`);
})