import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import leadRoutes from "./routes/lead.js";


dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
    cors({
       origin:"lead-management-system-ecru.vercel.app",
       credentials: true
    }));




app.get("/", (req, res) => {
    res.send("Backend is running");
})


app.use("/auth", authRoutes);
app.use("/leads", leadRoutes);




app.listen(PORT, () => {
    console.log(`Media service is listening on http://localhost:${PORT}`);
})