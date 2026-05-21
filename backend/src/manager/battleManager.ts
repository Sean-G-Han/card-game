import { Result } from "../types/result";
import { ManyToManyRelation, OneToOneRelation } from "./relations";

export class PendingBattleManager {
    private static instance: PendingBattleManager;
    
    // Challenger -> Defender (Only storing names)
    private chalToDefMap = new ManyToManyRelation<string, string>()

    private constructor() {}

    public static getInstance(): PendingBattleManager {
        if (!PendingBattleManager.instance) {
            PendingBattleManager.instance = new PendingBattleManager();
        }
        return PendingBattleManager.instance;
    }

    public set(challenger: string, defender: string): Result<void> {
        return this.chalToDefMap.set(challenger, defender);
    }

    public getChallengers(defender: string): Result<ReadonlySet<string>> {
        return this.chalToDefMap.getKeysFromValue(defender)
    }

    public getDefenders(challenger: string): Result<ReadonlySet<string>> {
        return this.chalToDefMap.getValuesFromKey(challenger)
    }

    // For accepting/withdrawing/reject from challenge
    public resolveChallenger(challenger: string, defender: string): Result<void> {
        return this.chalToDefMap.deleteEntry(challenger, defender)
    }

    public disconnectPlayer(player: string): Result<ReadonlySet<string>> {
        const result1 = this.chalToDefMap.cascadeDeleteKey(player)
        const result2 = this.chalToDefMap.cascadeDeleteValue(player)
        const playersChallenged = result1.getElse(new Set())
        const playersChallenging = result2.getElse(new Set())
        return Result.success(playersChallenged.union(playersChallenging) as ReadonlySet<string>)
    }
}

type Pair<T> = {
    a: T,
    b: T
}

export class RoomManager {
    private static instance: RoomManager;
    
    private roomToPlayers = new OneToOneRelation<string, Pair<string>>()

    private constructor() {}

    public static getInstance(): RoomManager {
        if (!RoomManager.instance) {
            RoomManager.instance = new RoomManager();
        }
        return RoomManager.instance;
    }

    public set(roomid: string, playerA: string, playerB: string) {
        this.roomToPlayers.set(roomid, {a: playerA, b: playerB})
    }
}