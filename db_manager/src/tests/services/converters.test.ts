import { stringToInteger } from "../../services/converters.js";

test('string 3 should be int 3 ', () => {
    expect(stringToInteger("3")).toBe(3);
});

test('string 3 should be int 3 ', () => {
    try {
        stringToInteger("3.3");
        expect(true).toBe(false)
    } catch (error) {
        console.log((error as Error).message);
        expect(true).toBe(true)
    }
});

test('string 3 should be int 3 ', () => {
    try {
        stringToInteger("hello");
        expect(true).toBe(false)
    } catch (error) {
        console.log((error as Error).message);
        expect(true).toBe(true)
    }
});