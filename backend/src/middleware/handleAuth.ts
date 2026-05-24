import { NextFunction, Response, Request } from "express";
import { ENV } from "../config/env";
import jwt from "jsonwebtoken"

export function handleVerification(req: Request, res: Response, next: NextFunction) {
    const token = req.body?.accessToken
    if (!token) {
        return res.status(401).json({
            message: "Access token missing"
        });
    }

    try {
        const decoded = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
        // (decoded as User).id ...
        // Note this does not have any logic like check for ban users or if users exists in DB.
        next();
    } catch (err) {
        return res.status(401).json("Invalid or expired token");
    }
}