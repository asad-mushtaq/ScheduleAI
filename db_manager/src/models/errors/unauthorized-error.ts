import { CustomError } from "./custom-error.js";

export default class Unauthorized extends CustomError {
    private static readonly _statusCode = 401;
    private readonly _logging: boolean;
    private readonly _context: { [key: string]: any };

    constructor(params?: { message?: string, logging?: boolean, context?: { [key: string]: any } }) {
        const { message, logging } = params || {};

        super(message || "Not Authorized");
        this._logging = logging || false;
        this._context = params?.context || {};

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, Unauthorized.prototype);
    }

    get errors() {
        return [{ message: this.message, context: this._context }];
    }

    get statusCode() {
        return Unauthorized._statusCode;
    }

    get logging() {
        return this._logging;
    }
}