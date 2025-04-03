import BadRequestError from "../../models/errors/bad-request-error.js";
import { stringToInteger } from "../../services/converters.js";
import { verifyId } from "../../services/verification.js";

test('adds 1 + 2 to equal 3', () => {
    expect(stringToInteger("3")).toBe(3);
});

test('3.3 is not a valid ID', () => {
    try {
        verifyId("3.3");
        expect(true).toBe(false)
    } catch (error) {
        console.log((error as BadRequestError).message);
        expect(true).toBe(true)
    }
});

test('hello is not a valid ID', () => {
    try {
        verifyId("hello");
        expect(true).toBe(false)
    } catch (error) {
        console.log((error as BadRequestError).message);
        expect(true).toBe(true)
    }
});