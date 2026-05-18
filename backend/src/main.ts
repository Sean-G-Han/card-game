import express from "express";
import dotenv from "dotenv";
import { register, login, assignRefresh, refreshAccessToken } from "./auth";
import jwt from "jsonwebtoken";
import { pool } from "./db/db";
import cookieParser from "cookie-parser";

dotenv.config();

const JWT_SECRET2 = process.env.JWT_SECRET2!;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/register", async (req, res) => {
    const result = await register(req.body.username, req.body.password);

    if (!result.ok) {
        return res.status(400).json({ error: result.error });
    }

    const { accessToken, refreshToken } = result.data;

    assignRefresh(res, refreshToken)

    return res.json({
        accessToken
    });
});

app.post("/login", async (req, res) => {
    const result = await login(req.body.username, req.body.password);

    if (!result.ok) {
        return res.status(400).json({ error: result.error });
    }

    const { accessToken, refreshToken } = result.data;

    assignRefresh(res, refreshToken)

    return res.json({
        accessToken
    });
});

app.post("/refresh", async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({ error: "No refresh token" });
    }

    try {
        const payload = jwt.verify(
            token,
            JWT_SECRET2
        ) as {id: string};

        const result = await refreshAccessToken(
            payload.id
        );

        if (!result.ok) {
            return res.status(403).json({
                error: result.error
            });
        }

        return res.json({
            accessToken: result.data
        });

    } catch {
        return res.status(403).json({
            error: "Invalid refresh token"
        });
    }
});

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