import { Socket, Server } from "socket.io";
import { UserManager } from "../../manager/userManager";
import { User } from "../../types/user";
import { PendingBattleManager } from "../../manager/battleManager";

export function registerChallengeHandler(socket: Socket, io: Server) {
    const userManager = UserManager.getInstance()
    const pendingManager = PendingBattleManager.getInstance()
    const user: User = socket.data.user

    socket.on("challenge", (opponentName) => {
        const userName = user.username
        const userResult = userManager.getSocketId(userName)
        const opponentResult = userManager.getSocketId(opponentName)

        if (!opponentResult.isOk() || !userResult.isOk()) {
            socket.emit("challenge-error", "Opponent not online");
            return;
        }

        pendingManager.set(userResult.unwrap(), opponentResult.unwrap())

        io.to(opponentResult.unwrap()).emit("challenge-request", {
            from: userName
        });
    });

    socket.on("challenge-accepted", (opponentName) => {
        const userName = user.username
        const userResult = userManager.getSocketId(userName)
        const opponentResult = userManager.getSocketId(opponentName)

        if (!opponentResult.isOk() || !userResult.isOk()) {
            socket.emit("challenge-error", "Opponent not online");
            return;
        }        

        const challengers = pendingManager.getChallengers(userName)

        if (!challengers.isOk() || !challengers.unwrap().has(opponentName)) {
            socket.emit("challenge-error", "Opponent has withdrew challenge");
            return;
        }

        pendingManager.resolveChallenger(opponentResult.unwrap(), userResult.unwrap())
    });
}