import ResultFactory, { Result } from "../types/result";

function asReadonlySet<T>(set: Set<T> | Result<Set<T>>): ReadonlySet<T> {
    if ("ok" in set) {
        if (set.ok)
            return set.data as ReadonlySet<T>;
        return new Set() as ReadonlySet<T>
    }
    return set as ReadonlySet<T>;
}

export class OneToOneRelation<K, V> {
    private forwardMap: Map<K, V> = new Map<K, V>();
    private backwardMap: Map<V, K> = new Map<V, K>();

    public set(key: K, value: V): Result<void> {
        this.forwardMap.set(key, value);
        this.backwardMap.set(value, key);
        return ResultFactory.success();
    }

    public get(key: K): Result<V> {
        const value = this.forwardMap.get(key);
        if (value === undefined) {
            return ResultFactory.failure("Key doesn't exist");
        }
        return ResultFactory.success(value);
    }

    public getOrInsert(key: K, defaultValue: V): Result<V> {
        const existing = this.forwardMap.get(key);
        if (existing !== undefined) {
            return ResultFactory.success(existing);
        }

        this.forwardMap.set(key, defaultValue);
        this.backwardMap.set(defaultValue, key);
        return ResultFactory.success(defaultValue);
    }

    // Returns affected value for update purposes
    public deleteFromKey(key: K): Result<V> {
        const value = this.forwardMap.get(key);
        if (value === undefined) {
            return ResultFactory.failure("Key doesn't exist");
        }

        this.forwardMap.delete(key);
        this.backwardMap.delete(value);

        return ResultFactory.success(value);
    }

    // Returns affected value for update purposes
    public deleteFromValue(value: V): Result<K> {
        const key = this.backwardMap.get(value);
        if (key === undefined) {
            return ResultFactory.failure("Value doesn't exist");
        }

        this.forwardMap.delete(key);
        this.backwardMap.delete(value);

        return ResultFactory.success(key);
    }

    public getKeyFromValue(value: V): Result<K> {
        const key = this.backwardMap.get(value);
        if (key === undefined) {
            return ResultFactory.failure("Value doesn't exist");
        }
        return ResultFactory.success(key);
    }

    public getValueFromKey(key: K): Result<V> {
        const value = this.forwardMap.get(key);
        if (value === undefined) {
            return ResultFactory.failure("Key doesn't exist");
        }
        return ResultFactory.success(value);
    }

    public size(): number {
        return this.forwardMap.size;
    }
}

export class ManyToManyRelation<K, V> {
    private forwardMap: OneToOneRelation<K, Set<V>> =
        new OneToOneRelation<K, Set<V>>();

    private backwardMap: OneToOneRelation<V, Set<K>> =
        new OneToOneRelation<V, Set<K>>();

    public set(key: K, value: V, limit?: number): Result<void> {
        const forwardRes = this.forwardMap.getOrInsert(key, new Set<V>());
        if (!forwardRes.ok) return forwardRes; // this is a failure object

        const backwardRes = this.backwardMap.getOrInsert(value, new Set<K>());
        if (!backwardRes.ok) return backwardRes;

        const forwardSet = forwardRes.data;
        const backwardSet = backwardRes.data;

        if (limit !== undefined && forwardSet.size >= limit) {
            return ResultFactory.failure("Limit reached for key");
        }

        forwardSet.add(value);
        backwardSet.add(key);

        return ResultFactory.success();
    }

    public getKeysFromValue(value: V): Result<ReadonlySet<K>> {
        const res = this.backwardMap.getValueFromKey(value);
        if (!res.ok) return res;

        return ResultFactory.success(asReadonlySet(res.data));
    }

    public getValuesFromKey(key: K): Result<ReadonlySet<V>> {
        const res = this.forwardMap.getValueFromKey(key);
        if (!res.ok) return res;

        return ResultFactory.success(asReadonlySet(res.data));
    }

    public deleteEntry(key: K, value: V): Result<void> {
        const forwardRes = this.forwardMap.getValueFromKey(key);
        if (!forwardRes.ok) return forwardRes;

        const set = forwardRes.data;
        set.delete(value);

        const backwardRes = this.backwardMap.getValueFromKey(value);
        if (!backwardRes.ok) return backwardRes;

        const backSet = backwardRes.data;
        backSet.delete(key);

        return ResultFactory.success();
    }

    // Returns affected value for update purposes
    public cascadeDeleteKey(key: K): Result<ReadonlySet<V>> {
        const valuesRes = this.forwardMap.getValueFromKey(key);
        if (!valuesRes.ok) return valuesRes;

        const values = valuesRes.data;

        for (const value of values) {
            const keysRes = this.backwardMap.getValueFromKey(value);
            if (!keysRes.ok) continue;

            const keys = keysRes.data;
            keys.delete(key);

            if (keys.size === 0) {
                this.backwardMap.deleteFromKey(value);
            }
        }

        return ResultFactory.success(asReadonlySet(valuesRes));
    }

    // Returns affected value for update purposes
    public cascadeDeleteValue(value: V): Result<ReadonlySet<K>> {
        const keysRes = this.backwardMap.getValueFromKey(value);
        if (!keysRes.ok) return keysRes;

        const keys = keysRes.data;

        for (const key of keys) {
            const valuesRes = this.forwardMap.getValueFromKey(key);
            if (!valuesRes.ok) continue;

            const values = valuesRes.data;
            values.delete(value);

            if (values.size === 0) {
                this.forwardMap.deleteFromKey(key);
            }
        }

        return ResultFactory.success(asReadonlySet(keysRes));
    }
}