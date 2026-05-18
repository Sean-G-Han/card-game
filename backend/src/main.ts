import express, { Response } from "express";
import dotenv from "dotenv";
import { register, login, assignRefresh, refresh } from "./auth";
import { pool } from "./db/db";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

function handleAuthResponse(res: Response, result: any) {
    if (!result.ok) {
        return res.status(400).json({ error: result.error });
    }
    const { accessToken, refreshToken } = result.data;
    assignRefresh(res, refreshToken);
    return res.json({ accessToken });
}

app.post("/register", async (req, res) => {
    const result = await register(req.body.username, req.body.password);
    return handleAuthResponse(res, result);
});

app.post("/login", async (req, res) => {
    const result = await login(req.body.username, req.body.password);
    return handleAuthResponse(res, result);
});

app.post("/refresh", async (req, res) => {
    const token = req.cookies.refreshToken as string | undefined;
    const result = await refresh(token);
    return handleAuthResponse(res, result);
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