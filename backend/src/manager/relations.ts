import { Result } from "../types/result";


function asReadonlySet<T>(set: Set<T>): ReadonlySet<T> {
    return set as ReadonlySet<T>
}

export class OneToOneRelation<K, V> {
    private forwardMap = new Map<K, V>()
    private backwardMap = new Map<V, K>()

    public set(key: K, value: V): Result<void> {
        this.forwardMap.set(key, value)
        this.backwardMap.set(value, key)
        return Result.success(undefined)
    }

    public get(key: K): Result<V> {
        return Result
            .success(this.forwardMap.get(key))
            .filter<V>(
                (v) => v !== undefined,
                "Key doesn't exist"
            )
    }

    public getOrInsert(key: K, defaultValue: V): Result<V> {
        return this.get(key).mapError((e) => {
            this.forwardMap.set(key, defaultValue)
            this.backwardMap.set(defaultValue, key)
            return defaultValue
        })
    }

    public deleteFromKey(key: K): Result<V> {
        return this.get(key).map(v => {
            this.forwardMap.delete(key)
            this.backwardMap.delete(v)
            return v
        })
    }

    public deleteFromValue(value: V): Result<K> {
        const key = this.backwardMap.get(value)

        return key === undefined
            ? Result.failure("Value doesn't exist")
            : Result.success(key).map(k => {
                this.forwardMap.delete(k)
                this.backwardMap.delete(value)
                return k
            })
    }

    public getKeyFromValue(value: V): Result<K> {
        const key = this.backwardMap.get(value)

        return key === undefined
            ? Result.failure("Value doesn't exist")
            : Result.success(key)
    }

    public getValueFromKey(key: K): Result<V> {
        return this.get(key)
    }

    public size(): number {
        return this.forwardMap.size
    }
}

export class ManyToManyRelation<K, V> {
    private forwardMap = new OneToOneRelation<K, Set<V>>()
    private backwardMap = new OneToOneRelation<V, Set<K>>()

    public set(key: K, value: V, limit?: number): Result<void> {
        return this.forwardMap
            .getOrInsert(key, new Set<V>())
            .flatMap(forwardSet => {
                if (limit !== undefined && forwardSet.size >= limit) {
                    return Result.failure("Limit reached for key")
                }

                return this.backwardMap
                    .getOrInsert(value, new Set<K>())
                    .map(backwardSet => {
                        forwardSet.add(value)
                        backwardSet.add(key)
                    })
            })
    }

    public getKeysFromValue(value: V): Result<ReadonlySet<K>> {
        return this.backwardMap
            .getValueFromKey(value)
            .map(asReadonlySet)
    }

    public getValuesFromKey(key: K): Result<ReadonlySet<V>> {
        return this.forwardMap
            .getValueFromKey(key)
            .map(asReadonlySet)
    }

    public deleteEntry(key: K, value: V): Result<void> {
        return this.forwardMap
            .getValueFromKey(key)
            .flatMap(set => {
                set.delete(value)

                return this.backwardMap
                    .getValueFromKey(value)
                    .map(backSet => {
                        backSet.delete(key)
                    })
            })
    }

    public cascadeDeleteKey(key: K): Result<ReadonlySet<V>> {
        return this.forwardMap
            .getValueFromKey(key)
            .map(values => {
                for (const value of values) {
                    this.backwardMap
                        .getValueFromKey(value)
                        .tap(keys => {
                            keys.delete(key)

                            if (keys.size === 0) {
                                this.backwardMap.deleteFromKey(value)
                            }
                        })
                }

                return asReadonlySet(values)
            })
    }

    public cascadeDeleteValue(value: V): Result<ReadonlySet<K>> {
        return this.backwardMap
            .getValueFromKey(value)
            .map(keys => {
                for (const key of keys) {
                    this.forwardMap
                        .getValueFromKey(key)
                        .tap(values => {
                            values.delete(value)

                            if (values.size === 0) {
                                this.forwardMap.deleteFromKey(key)
                            }
                        })
                }

                return asReadonlySet(keys)
            })
    }
}