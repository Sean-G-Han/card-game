type Success<T> = 
T extends void  ? { ok: true, data: undefined}
                : { ok: true, data: T }


type Failure = {
    ok: false,
    error: string
}

export type Result<T> = Success<T> | Failure

export default class ResultFactory {
    // YH Notes these 2 are not run but just serve as typescript rules (i.e. signatures)
    static success(): Success<void>
    static success<T>(data: T): Success<T>
    // This is the only success function that runs
    static success<T>(data?: T) {
        if (data === undefined) {
            return { ok: true } as Success<void>
        }
        return { ok: true, data }
    }
    static failure(error: string): Failure {
        return { ok: false, error };
    }
}