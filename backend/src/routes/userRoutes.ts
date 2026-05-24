import express from "express";
import dotenv from "dotenv";
import { pool } from "../db/db";
import { handleVerification } from "../middleware/handleAuth";
import { UserManager } from "../manager/userManager";

dotenv.config();

const router = express.Router();

router.use(handleVerification);

// for debug only
router.get("/all", async (req, res) => {
    const users = await pool.query(
        `SELECT username FROM users`
    );
    res.status(200).json({users: users.rows[0]})
});

router.get("/", async (req, res) => {
    const userManager = UserManager.getInstance()
    res.status(200).json({users: userManager.getAllActiveUsers()})
})

export default router