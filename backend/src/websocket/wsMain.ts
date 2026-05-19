import http from "http";
import { Server } from "socket.io";
import { socketAuth } from "./middleware/socketAuth";
import { handleConnection } from "./handlers/connectionHandler";

export function createSocketServer(server: http.Server) {
    const io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.use(socketAuth);

    io.on("connection", (socket) => {
        handleConnection(socket, io);
    });

    return io;
}