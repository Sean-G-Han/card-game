import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "./db/db";
import { User } from "./types/user"
import { Result } from "./types/result"
import { AccessTokenPayload, RefreshTokenPayload, TokenPair } from "./types/auth";
import { Response } from "express";
import { ENV } from "./config/env";

const ACCESS_TOKEN_SECRET = ENV.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = ENV.REFRESH_TOKEN_SECRET

export async function register(username: string, password: string): Promise<Result<TokenPair>> {
    // TODO: (Priority: Medium) Consider creating a wrapper function for this try catch
    try {
        const hash = await bcrypt.hash(password, 10);

        const res = await pool.query(
            `INSERT INTO users (username, password_hash) VALUES ($1, $2)
             RETURNING id, username`,
            [username, hash]
        );

        const payload: User = {
            id: res.rows[0].id,
            username: res.rows[0].username
        };

        const accessToken = createAccessToken(payload);
        const refreshToken = createRefreshToken(payload); 
        // YH Notes: Refresh token should have less info incase stolen

        return Result.success({accessToken, refreshToken})

    } catch (err: any) {
        if (err.code === "23505") { // YH Notes: Postgres unique violation
            return Result.failure("Username already exists");
        }
        return Result.failure("Failed to register user");
    }
}

export async function login(username: string, password: string): Promise<Result<TokenPair>> {
    try {
        const res = await pool.query(
            `SELECT * FROM users
             WHERE username = $1`,
            [username]
        );

        const user = res.rows[0];

        if (!user) {
            return Result.failure("Invalid username/password");
        }

        const valid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!valid) {
            return Result.failure("Invalid username/password");
        }

        const payload: User = {
            id: user.id,
            username: user.username
        };

        const accessToken = createAccessToken(payload);
        const refreshToken = createRefreshToken(payload);

        return Result.success({accessToken, refreshToken})

    } catch (err) {
        return Result.failure("Failed to login user");
    }
}

export async function refresh(token: string | undefined): Promise<Result<TokenPair>> {
    if (!token) return Result.failure("No Refresh Token")
    try {
        const result = jwt.verify(
            token,
            REFRESH_TOKEN_SECRET
        ) as {id: string};
        
        const res = await pool.query(
            `SELECT id, username
             FROM users
             WHERE id = $1`,
            [result.id]
        );

        const user = res.rows[0];

        if (!user) {
            return Result.failure("User not found");
        }

        const payload: User = {
            id: user.id,
            username: user.username
        };

        const accessToken = createAccessToken(payload);
        const refreshToken = createRefreshToken(payload);

        return Result.success({accessToken, refreshToken})

    } catch {
        return Result.failure("Refresh failed");
    }
}

export function assignRefresh(res: Response, refreshToken: string) {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // secure: true  // set false only in local dev if needed
        sameSite: "strict",
        path: "/refresh"
    });
}

function createAccessToken(user: AccessTokenPayload): string {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
}

function createRefreshToken(userId: RefreshTokenPayload): string {
    return jwt.sign(userId, REFRESH_TOKEN_SECRET, { expiresIn: "7d" })
}