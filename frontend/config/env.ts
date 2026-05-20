import dotenv from "dotenv";

dotenv.config();

function requireEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing env variable: ${name}`);
    }

    return value;
}

export const ENV = {
    BACKEND_URL: requireEnv("BACKEND_URL"),
    ACCESS_TOKEN_SECRET: requireEnv("ACCESS_TOKEN_SECRET"),
    REFRESH_TOKEN_SECRET: requireEnv("REFRESH_TOKEN_SECRET"),
    PORT: requireEnv("PORT")
};