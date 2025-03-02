import { Request, Response } from 'express';
import { genSaltSync, hashSync } from "bcrypt-ts";

import { User } from "../../models/user.js"
import { errorHandler } from '../../services/errors.js';
import * as service from "../../database/crud/user.js"
import { verifyId } from '../../services/verify-params.js';


export async function createUser(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const salt = genSaltSync(10);
		const hash = hashSync(req.body.password, salt);
		const user = await service.createUser(req.body.email, req.body.username, hash);
		console.log(user.email);
		res.json(user);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		const user = await service.deleteUser(id) as User;
		res.json(user);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function getUserById(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		const user = await service.getUser(id) as User;
		res.json(user);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function getAllUsers(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const users = await service.getAllUsers() as User[];
		res.json(users);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function editUser(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const salt = genSaltSync(10);
		const hash = hashSync(req.body.password, salt);
		const user = await service.updateUser(req.body.id, req.body.email, req.body.username, hash) as User;
		res.json(user);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}
