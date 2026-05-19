import { Result } from "../types/result";
import { OneToOneRelation } from "./relations";

export class UserManager {
    private static instance: UserManager;

    private socketToUser = new OneToOneRelation<string, string>()

    private constructor() {}

    public static getInstance(): UserManager {
        if (!UserManager.instance) {
            UserManager.instance = new UserManager();
        }
        return UserManager.instance;
    }

    public set(socketId: string, username: string): Result<void>  {
        return this.socketToUser.set(socketId, username);
    }

    public getUsername(socketId: string): Result<string> {
        return this.socketToUser.getValueFromKey(socketId);
    }

    public getSocketId(username: string): Result<string> {
        return this.socketToUser.getKeyFromValue(username);
    }

    public disconnectPlayer(socketId: string): Result<string>  {
        return this.socketToUser.deleteFromKey(socketId)
    }
}