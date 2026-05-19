/*
* For basic HTTP Req Res stuff
*/
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes"
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", authRoutes)

/*
* For basic Websocket stuff
*/
import http from "http";
import { Server } from "socket.io";
import { User } from "./types/user";
import { UserManager } from "./manager/userManager";
import { PendingBattleManager } from "./manager/battleManager";
import { registerUserSockets } from "./routes/userSocket";

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*" } // temp fix
});

io.use((socket, next) => {
    const accessToken = socket.handshake.auth?.token;

    try {
        const user = jwt.verify(accessToken, process.env.JWT_SECRET!) as User;
        socket.data.user = user;
        next();
    } catch {
        next(new Error("Unauthorized"));
    }
});

io.on("connection", (socket) => {
    const user: User = socket.data.user
    const userManager = UserManager.getInstance()
    userManager.set(socket.id, user.username)
    const pendingManager = PendingBattleManager.getInstance()

    registerUserSockets(socket, io)

    socket.on("disconnect", () => {
        userManager.disconnectPlayer(socket.id);
        pendingManager.disconnectPlayer(socket.id)
    });
});

server.listen(3000, () => console.log("Server running on 3000"));