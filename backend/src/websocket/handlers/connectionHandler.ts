import { Server, Socket } from "socket.io";
import { User } from "../../types/user";
import { UserManager } from "../../manager/userManager";
import { PendingBattleManager } from "../../manager/battleManager";
import { registerChallengeHandler } from "./challengeHandler";

export function handleConnection(socket: Socket, io: Server) {
    const user = socket.data.user as User;

    const userManager = UserManager.getInstance();
    const pendingManager = PendingBattleManager.getInstance();

    userManager.set(socket.id, user.username);

    registerChallengeHandler(socket, io);

    socket.on("disconnect", () => {
        userManager.disconnectPlayer(socket.id);
        pendingManager.disconnectPlayer(socket.id);
    });
}