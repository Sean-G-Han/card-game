export class BiDirectionalMap<K, V>{
    private forwardMap: Map<K, V> = new Map<K, V>();
    private backwardMap: Map<V, K> = new Map<V, K>();

    public set(key: K, value: V) {
        this.forwardMap.set(key, value);
        this.backwardMap.set(value, key);
    }

    public getKeyFromValue(value: V) {
        this.backwardMap.get(value)
    }

    public getValueFromKey(key: K) {
        this.forwardMap.get(key)
    }

    public deleteFromKey(key: K) {
        const value: V | undefined = this.forwardMap.get(key);
        if (!value) return;

        this.forwardMap.delete(key);
        this.backwardMap.delete(value);
    }
    
    public deleteFromValue(value: V) {
        const key: K | undefined = this.backwardMap.get(value);
        if (!key) return;

        this.forwardMap.delete(key);
        this.backwardMap.delete(value);
    }
}