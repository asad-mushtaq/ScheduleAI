import { stringToInteger } from "../../services/converters.js";

test('adds 1 + 2 to equal 3', () => {
    expect(stringToInteger("3")).toBe(3);
});