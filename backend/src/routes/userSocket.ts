import { Socket, Server } from "socket.io";
import { UserManager } from "../manager/userManager";
import { User } from "../types/user";
import { PendingBattleManager } from "../manager/battleManager";

export function registerUserSockets(socket: Socket, io: Server) {
    const userManager = UserManager.getInstance()
    const pendingManager = PendingBattleManager.getInstance()
    const user: User = socket.data.user

    socket.on("challenge", (opponentName) => {
        const userName = user.username
        const userResult = userManager.getSocketId(userName)
        const opponentResult = userManager.getSocketId(opponentName)

        if (!opponentResult.ok || !userResult.ok) {
            socket.emit("challenge-error", "Opponent not online");
            return;
        }

        pendingManager.set(userResult.data, opponentResult.data)

        io.to(opponentResult.data).emit("challenge-request", {
            from: userName
        });
    });

    socket.on("challenge-accepted", (opponentName) => {
        const userName = user.username
        const userResult = userManager.getSocketId(userName)
        const opponentResult = userManager.getSocketId(opponentName)

        if (!opponentResult.ok || !userResult.ok) {
            socket.emit("challenge-error", "Opponent not online");
            return;
        }

        pendingManager.resolveChallenger(opponentResult.data, userResult.data)
    });
}