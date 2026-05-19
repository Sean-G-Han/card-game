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

    public set(challenger: string, defender: string) {
        this.chalToDefMap.set(challenger, defender);
    }

    public getChallengers(defender: string) {
        this.chalToDefMap.getKeysFromValue(defender)
    }

    public getDefenders(challenger: string) {
        this.chalToDefMap.getValuesFromKey(challenger)
    }

    // For accepting/withdrawing/reject from challenge
    public resolveChallenger(challenger: string, defender: string) {
        this.chalToDefMap.deleteEntry(challenger, defender)
    }

    public disconnectPlayer(player: string) {
        this.chalToDefMap.cascadeDeleteKey(player)
        this.chalToDefMap.cascadeDeleteValue(player)
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