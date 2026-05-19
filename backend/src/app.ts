import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";

export function createApp() {
    const app = express();

    app.use(express.json());
    app.use(cookieParser());

    app.use("/", authRoutes);

    return app;
}