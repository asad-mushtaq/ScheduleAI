import { Request, Response } from 'express';
import { genSaltSync, hashSync } from "bcrypt-ts";
import "dotenv/config";
import jwt from 'jsonwebtoken';
import { sign } from 'jsonwebtoken';
import { User } from "../models/user.js"
import { errorHandler } from '../services/errors.js';
import * as service from "../database/crud/user.js"
import { verifyId, verifyIdentity } from '../services/verification.js';


export async function getAllUsers(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const users = await service.getAllUsers();
		let jsonUsers = Array();
		users.forEach((user: User) => {
			jsonUsers.push(user.toJSON());
		});
		res.json(jsonUsers);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function createUser(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const salt = genSaltSync(10);
		const hash = hashSync(req.body.password, salt);
		const user = await service.createUser(req.body.firstName, req.body.lastName, req.body.email, hash);
		res.json(user.toJSON());
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function createAdminUser(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const salt = genSaltSync(10);
		const hash = hashSync(req.body.password, salt);
		const user = await service.createAdminUser(req.body.firstName, req.body.lastName, req.body.email, hash);
		res.json(user.toJSON());
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function logIn(req: Request, res: Response): Promise<void>  {
    try {
        // Load hash from your password DB.
        const user = await service.logIn(req.body.email, req.body.password) as User;

		const secret: jwt.Secret = process.env.JWT_SECRET!;
		const token = jwt.sign(user.toJSON(), secret, { expiresIn: "30d" })

		res.cookie("token", token, {
			httpOnly: true
		})

        res.json(user);
    } catch (error) {
        errorHandler(error as Error, res);
    } 
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		res = verifyIdentity(req.cookies.token, id, res);
		const user = await service.deleteUser(id);
		res.json(user.toJSON());
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function getUserById(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		res = verifyIdentity(req.cookies.token, id, res);
		const user = await service.getUser(id);
		res.json(user.toJSON());
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function getUserEvents(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		res = verifyIdentity(req.cookies.token, id, res);
		const events = await service.getUserEvents(id);
		let jsonEvents = Array();
		events.forEach(event => {
			jsonEvents.push(event.toJSON());
		});
		res.json(jsonEvents);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function getUserPayments(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		res = verifyIdentity(req.cookies.token, id, res);
		const payments = await service.getUserPayments(id);
		let jsonPayments = Array();
		payments.forEach(payment => {
			jsonPayments.push(payment.toJSON());
		});
		res.json(jsonPayments);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function getUserQueries(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		res = verifyIdentity(req.cookies.token, id, res);
		const queries = await service.getUserQueries(id);
		let jsonQueries = Array();
		queries.forEach(query => {
			jsonQueries.push(query.toJSON());
		});
		res.json(jsonQueries);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function getUserSubscription(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		res = verifyIdentity(req.cookies.token, id, res);
		const payment = await service.getUserSubscription(id);
		res.json(payment.toJSON());
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function editUser(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		res = verifyIdentity(req.cookies.token, id, res);
		let user = null;
		if(req.body.password !== undefined) {
			const salt = genSaltSync(10);
			const hash = hashSync(req.body.password, salt);
			user = await service.updateUser(id, req.body.firstName, req.body.lastName, req.body.email, hash);
		} else {
			user = await service.updateUser(id, req.body.firstName, req.body.lastName, req.body.email, null);
		}
		res.json(user.toJSON());
	} catch (error) {
		errorHandler(error as Error, res);
	}
}
