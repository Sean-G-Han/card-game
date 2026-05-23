type Success<T> = { 
    ok: true, 
    data: T 
}

type Failure = {
    ok: false,
    error: string
}

export type ResultData<T> = Success<T> | Failure

export class Result<T> {
    result: ResultData<T>
    private constructor(result: ResultData<T>) {
        this.result = result
    }

    static success<T>(data: T): Result<T> {
        return new Result({ ok: true, data })
    }

    static failure<T>(error: string): Result<T> {
        return new Result({ ok: false, error })
    }

    isOk(): boolean {
        return this.result.ok
    }

    getError(): string {
        if (this.result.ok)
            return ""
        return this.result.error
    }

    /**
     * Please try to avoid this function.
     * Basically like "get()" where it will also throw an error
     */
    unwrap(): T {
        if (this.result.ok) {
            return this.result.data
        }
        throw new Error(this.result.error)
    }

    getElse(defaultValue: T): T {
        if (this.result.ok) {
            return this.result.data
        }
        return defaultValue
    }

    tap(fn: (v: T) => void): Result<T> {
        if (this.result.ok) fn(this.result.data)
        return this
    }

    tapError(fn: (e: string) => void): Result<T> {
        if (!this.result.ok) fn(this.result.error)
        return this
    }

    map<OutputType>(func: (v: T) => OutputType): Result<OutputType> {
        if (this.result.ok) {
            return Result.success(func(this.result.data))
        }
        return Result.failure(this.result.error)
    }

    mapError(func: (e: string) => T): Result<T> {
        if (!this.result.ok) {
            return Result.success(func(this.result.error))
        }
        return this
    }

    flatMap<OutputType>(func: (v: T) => Result<OutputType>): Result<OutputType> {
        if (this.result.ok) {
            return func(this.result.data)
        }
        return Result.failure(this.result.error)
    }

    flatMapError(func: (e: string) => Result<T>): Result<T> {
        if (!this.result.ok) {
            return func(this.result.error)
        }
        return this
    }

    filter(pred: (v: T) => boolean, error: string): Result<T>

    // YH Notes this is for narrowing for cases where the Result<T | undefined>
    // So when using filter<X>(...) the output is a Result<X> where X is a subtype of T
    filter<OutputType extends T>(pred: (v: T) => v is OutputType, error: string): Result<OutputType>

    filter(pred: (v: T) => boolean, error: string): Result<T> {
        if (!this.result.ok || pred(this.result.data)) {
            return this
        }
        return Result.failure(error)
    }
}