import { ManyToManyRelation, OneToOneRelation } from "../manager/relations";

test("OneToOneRelation: set and get works", () => {
    const map = new OneToOneRelation<string, number>();
    map.set("a", 1);

    const result1 = map.getValueFromKey("a");
    const result2 = map.getKeyFromValue(1)

    expect(result1.isOk()).toBe(true);
    if (result1.isOk()) {
        expect(result1.unwrap()).toBe(1);
    }

    expect(result2.isOk()).toBe(true);
    if (result2.isOk()) {
        expect(result2.unwrap()).toBe("a");
    }
});

test("OneToOneRelation: delete works", () => {
    const map = new OneToOneRelation<string, number>();
    map.set("a", 1);
    map.set("b", 2);

    const result1 = map.deleteFromKey("a")
    const result2 = map.deleteFromValue(2)

    expect(result1.isOk()).toBe(true);
    if (result1.isOk()) {
        expect(result1.unwrap()).toBe(1);
    }

    expect(result2.isOk()).toBe(true);
    if (result2.isOk()) {
        expect(result2.unwrap()).toBe("b");
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
    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
        expect(result.unwrap().has("Bob")).toBe(true)
        expect(result.unwrap().has("Charlie")).toBe(true)
        expect(result.unwrap().size).toBe(2)
    }

    const result1 = map.cascadeDeleteKey("Alice")
    expect(result1.isOk()).toBe(true)
    if (result1.isOk()) {
        expect(result1.unwrap().has("Bob")).toBe(true)
        expect(result1.unwrap().has("Charlie")).toBe(true)
        expect(result1.unwrap().size).toBe(2)
    }

    const result2 = map.getValuesFromKey("Eren")
    expect(result2.isOk()).toBe(true)
    if (result2.isOk()) {
        expect(result2.unwrap().has("Alice")).toBe(true)
        expect(result2.unwrap().has("Bob")).toBe(true)
        expect(result2.unwrap().size).toBe(2)
    }

    map.cascadeDeleteValue("Alice")
    const result3 = map.getValuesFromKey("Eren")
    expect(result3.isOk()).toBe(true)
    if (result3.isOk()) {
        expect(result3.unwrap().has("Bob")).toBe(true)
        expect(result3.unwrap().size).toBe(1)
    }
})