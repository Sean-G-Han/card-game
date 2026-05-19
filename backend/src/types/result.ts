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
    static success<T>(data: T | Result<T>): Success<T> | Failure
    // This is the only success function that runs
    static success<T>(data?: T | Result<T>) {
        if (!data) {
            return { ok: true } as Success<void>
        }
        if (typeof data === 'object' && 'ok' in data) {
            return data as Result<T>
        }
        return { ok: true, data }
    }
    static failure(error: string | Result<any>): Failure {
        if (typeof error === 'object' && 'ok' in error) {
            return error.ok ? { ok: false, error: 'Unhandled failure' } : error
        }
        return { ok: false, error };
    }
}