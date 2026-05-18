import express, { Response } from "express";
import dotenv from "dotenv";
import { assignRefresh, login, refresh, register } from "../auth";

dotenv.config();

const router = express.Router();

function handleAuthResponse(res: Response, result: any) {
    if (!result.ok) {
        return res.status(400).json({ error: result.error });
    }
    const { accessToken, refreshToken } = result.data;
    assignRefresh(res, refreshToken);
    return res.json({ accessToken });
}

router.post("/register", async (req, res) => {
    const result = await register(req.body.username, req.body.password);
    return handleAuthResponse(res, result);
});

router.post("/login", async (req, res) => {
    const result = await login(req.body.username, req.body.password);
    return handleAuthResponse(res, result);
});

router.post("/refresh", async (req, res) => {
    const token = req.cookies.refreshToken as string | undefined;
    const result = await refresh(token);
    return handleAuthResponse(res, result);
});

export default router