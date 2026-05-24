import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes"
import cors from "cors";

export function createApp() {
    const app = express();

    app.use(express.json());
    app.use(cookieParser());

    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true
    }));

    app.use("/", authRoutes);
    app.use("/users", userRoutes)

    return app;
}