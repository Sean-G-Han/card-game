import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/env";
import { User } from "../../types/user";

export function socketAuth(socket: Socket, next: (err?: Error) => void) {
    const accessToken = socket.handshake.auth?.token;

    if (!accessToken) {
        return next(new Error("Unauthorized"));
    }

    try {
        const user = jwt.verify(accessToken, ENV.ACCESS_TOKEN_SECRET) as User;

        socket.data.user = user;

        next();
    } catch {
        next(new Error("Unauthorized"));
    }
}