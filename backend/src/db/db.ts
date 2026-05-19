import { Pool } from "pg";
import dotenv from "dotenv";
import { ENV } from "../config/env";

dotenv.config();

export const pool = new Pool({
    connectionString: ENV.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});