import { stringToInteger } from "../../services/converters.js";

test('valid number number conversion', () => {
    expect(stringToInteger("3")).toBe(3);
});

test('check for valid non-float number', () => {
    try {
        stringToInteger("3.3");
        expect(true).toBe(false)
    } catch (error) {
        console.log((error as Error).message);
        expect(true).toBe(true)
    }
});

test('word is not a number ', () => {
    try {
        stringToInteger("hello");
        expect(true).toBe(false)
    } catch (error) {
        console.log((error as Error).message);
        expect(true).toBe(true)
    }
});