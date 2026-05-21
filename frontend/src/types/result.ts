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

    orElse(func: (err: string) => Result<T>): Result<T> {
        if (this.result.ok) {
            return this
        }
        return func(this.result.error)
    }

    tap(fn: (v: T) => void): Result<T> {
        if (this.result.ok) fn(this.result.data)
        return this
    }

    map<OutputType>(func: (v: T) => OutputType): Result<OutputType> {
        if (this.result.ok) {
            return Result.success(func(this.result.data))
        }
        return Result.failure(this.result.error)
    }

    flatMap<OutputType>(func: (v: T) => Result<OutputType>): Result<OutputType> {
        if (this.result.ok) {
            return func(this.result.data)
        }
        return Result.failure(this.result.error)
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