import { ManyToManyRelation, OneToOneRelation } from "../manager/relations";

test("OneToOneRelation: set and get works", () => {
    const map = new OneToOneRelation<string, number>();
    map.set("a", 1);

    const result1 = map.getValueFromKey("a");
    const result2 = map.getKeyFromValue(1)

    expect(result1.ok).toBe(true);
    if (result1.ok) {
        expect(result1.data).toBe(1);
    }

    expect(result2.ok).toBe(true);
    if (result2.ok) {
        expect(result2.data).toBe("a");
    }
});

test("OneToOneRelation: delete works", () => {
    const map = new OneToOneRelation<string, number>();
    map.set("a", 1);
    map.set("b", 2);

    const result1 = map.deleteFromKey("a")
    const result2 = map.deleteFromValue(2)

    expect(result1.ok).toBe(true);
    if (result1.ok) {
        expect(result1.data).toBe(1);
    }

    expect(result2.ok).toBe(true);
    if (result2.ok) {
        expect(result2.data).toBe("b");
    }
});

test("ManyToManyRelation: cascade delete", () => {
    const map = new ManyToManyRelation<string, string>();
    map.set("Alice", "Bob");
    map.set("Alice", "Charlie");
    map.set("Charlie", "Eren");
    map.set("Eren", "Alice");
    map.set("Eren", "Bob")

    const result = map.getValuesFromKey("Alice")
    expect(result.ok).toBe(true)
    if (result.ok) {
        expect(result.data.has("Bob")).toBe(true)
        expect(result.data.has("Charlie")).toBe(true)
        expect(result.data.size).toBe(2)
    }

    const result1 = map.cascadeDeleteKey("Alice")
    expect(result1.ok).toBe(true)
    if (result1.ok) {
        expect(result1.data.has("Bob")).toBe(true)
        expect(result1.data.has("Charlie")).toBe(true)
        expect(result1.data.size).toBe(2)
    }

    const result2 = map.getValuesFromKey("Eren")
    expect(result2.ok).toBe(true)
    if (result2.ok) {
        expect(result2.data.has("Alice")).toBe(true)
        expect(result2.data.has("Bob")).toBe(true)
        expect(result2.data.size).toBe(2)
    }

    map.cascadeDeleteValue("Alice")
    const result3 = map.getValuesFromKey("Eren")
    expect(result3.ok).toBe(true)
    if (result3.ok) {
        expect(result3.data.has("Bob")).toBe(true)
        expect(result3.data.size).toBe(1)
    }
})