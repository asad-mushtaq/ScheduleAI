import { stringToInteger } from "./converters.js";
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

import BadRequestError from "../models/errors/bad-request-error.js";
import Unauthorized from "../models/errors/unauthorized-error.js";
import { errorHandler } from "./errors.js";
import { User } from "../models/user.js";
import * as userDb from "../database/crud/user.js"

interface MyRequest extends Request {
    user?: any; // Use a specific type here if you have one
}

export function verifyId(id: string | number | undefined): number {
    try {
        if (typeof id === "number") {
            if (id % 1 != 0) {
                throw new BadRequestError({ code: 400, message: "Id must be a whole number!", logging: false });
            }
            return id;
        }
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

export async function verifyJwt(req: MyRequest, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    try {
        const secret: jwt.Secret = process.env.JWT_SECRET!;
        const user = jwt.verify(token, secret) as User;
        req.user = user;
        next();
    } catch (error) {
        res.clearCookie("token");
        errorHandler(new Unauthorized({ message: "Invalid Token" }), res);
    }
}


export function verifyIdentity(token: any, userId: number, res: Response) {
    const secret: jwt.Secret = process.env.JWT_SECRET!;
    const user: User = jwt.verify(token, secret) as User;
    if (user.id != userId && !user.admin) {
        res.clearCookie("token");
        throw new Unauthorized({ message: "Not authorized!" });
    }
    return res;
}

export async function verifyAdminJwt(req: MyRequest, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    try {
        const secret: jwt.Secret = process.env.JWT_SECRET!;
        const user = jwt.verify(token, secret) as User;
        if ((user as User).admin) {
            req.user = user;
            next();
        } else {
            errorHandler(new Unauthorized({ message: "Not Authorized" }), res);
        }
    } catch (error) {
        console.log((error as Error).message)
        res.clearCookie("token");
        errorHandler(new Unauthorized({ message: "Invalid Token" }), res);
    }
}