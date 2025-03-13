import { Request, Response } from 'express';
import { genSaltSync, hashSync } from "bcrypt-ts";

import { User } from "../models/user.js"
import { errorHandler } from '../services/errors.js';
import * as service from "../database/crud/user.js"
import { verifyId } from '../services/verify-params.js';


export async function createUser(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const salt = genSaltSync(10);
		const hash = hashSync(req.body.password, salt);
		const user = await service.createUser(req.body.firstName, req.body.lastName, req.body.email, hash);
		console.log(user.email);
		res.json(user.toJSON());
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function logIn(req: Request, res: Response): Promise<void>  {
    try {
        // Load hash from your password DB.
        const user = await service.logIn(req.body.username, req.body.password) as User;
        res.json(user);
    } catch (error) {
        errorHandler(error as Error, res);
    } 
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
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
		const payment = await service.getUserSubscription(id);
		res.json(payment.toJSON());
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function getAllUsers(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const users = await service.getAllUsers();
		let jsonUsers = Array();
		users.forEach(user => {
			jsonUsers.push(user.toJSON());
		});
		res.json(jsonUsers);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function editUser(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const salt = genSaltSync(10);
		const hash = hashSync(req.body.password, salt);
		const user = await service.updateUser(req.body.id, req.body.firstName, req.body.lastName, req.body.email, hash);
		res.json(user.toJSON());
	} catch (error) {
		errorHandler(error as Error, res);
	}
}
