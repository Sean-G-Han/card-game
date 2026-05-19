import { BiDirectionalCompleteMap } from "./bidirectionalMap";

export class PendingBattleManager {
    private static instance: PendingBattleManager;
    
    // Challenger -> Defender (Only storing names)
    private chalToDefMap = new BiDirectionalCompleteMap<string, string>()

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

    public withdrawChallenge(challenger: string, defender: string) {
        this.chalToDefMap.deleteEntry(challenger, defender)
    }

    public acceptChallenger(challenger: string, defender: string) {
        this.chalToDefMap.cascadeDeleteKey(challenger)
        this.chalToDefMap.cascadeDeleteKey(defender)
    }
}