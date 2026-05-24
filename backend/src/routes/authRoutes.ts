import express, { Response } from "express";
import dotenv from "dotenv";
import { assignRefresh, login, refresh, register } from "../auth";
import { Result } from "../types/result";
import { TokenPair } from "../types/auth";

dotenv.config();

const router = express.Router();

function handleAuthResponse(res: Response, result: Result<TokenPair>)  {
    result.tap((pair) => {
        const { accessToken, refreshToken } = pair
        assignRefresh(res, refreshToken);
        res.json({accessToken});
    }).tapError((e) => {
        res.status(400).json(e);
    })
}

router.post("/register", async (req, res) => {
    console.log(`Trying to register with ${req.body.username}, ${req.body.password}`)
    const result = await register(req.body.username, req.body.password);
    handleAuthResponse(res, result);
});

router.post("/login", async (req, res) => {
    const result = await login(req.body.username, req.body.password);
    handleAuthResponse(res, result);
});

router.post("/refresh", async (req, res) => {
    const token = req.cookies.refreshToken as string | undefined;
    const result = await refresh(token);
    handleAuthResponse(res, result);
});

export default router