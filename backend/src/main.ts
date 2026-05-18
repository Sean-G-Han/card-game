import express from "express";
import dotenv from "dotenv";
import { pool } from "./db/db";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes"

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", authRoutes)

// for debug only
app.get("/users", async (req, res) => {
    try {
        const users = await pool.query(
            `SELECT username FROM users`
        );

        return res.json(users.rows);

    } catch {
        return res.status(500).json({
            error: "Failed to fetch users"
        });
    }
});

app.listen(3000, () => console.log("Server running on 3000"));