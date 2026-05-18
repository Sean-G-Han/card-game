import { BiDirectionalMap } from "./bidirectionalMap";

export class UserManager {
    private static instance: UserManager;

    private socketToUser = new BiDirectionalMap<string, string>()

    private constructor() {}

    public static getInstance(): UserManager {
        if (!UserManager.instance) {
            UserManager.instance = new UserManager();
        }
        return UserManager.instance;
    }

    public set(socketId: string, username: string) {
        this.socketToUser.set(socketId, username);
    }

    public getUsername(socketId: string) {
        return this.socketToUser.getValueFromKey(socketId);
    }

    public getSocketId(username: string) {
        return this.socketToUser.getKeyFromValue(username);
    }

    public removeUser(socketId: string) {
        this.socketToUser.deleteFromKey(socketId)
    }
}