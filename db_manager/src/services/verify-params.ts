
import BadRequestError from "../models/errors/bad-request-error.js";
import { stringToInteger } from "./converters.js";

export function verifyId(id: string): number {
    try {
        const newId = stringToInteger(new String(id));
        return newId;
    } catch (error) {
        if (id === undefined || id === "") {
            throw new BadRequestError({ code: 400, message: "Id is blank.", logging: false });
        } else if (isNaN(+id)) {
            console.log(id);
            throw new BadRequestError({ code: 400, message: "Id must be a number!", logging: false });
        } else if (+id % 1 != 0) {
            throw new BadRequestError({ code: 400, message: "Id must be a whole number!", logging: false });
        }
        throw new BadRequestError({ code: 400, message: "Invalid Id.", logging: false });
    }
}