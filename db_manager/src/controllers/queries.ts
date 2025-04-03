import { Request, Response } from 'express';

import { errorHandler } from '../services/errors.js';
import * as service from "../database/crud/query.js"
import { verifyId, verifyIdentity } from '../services/verification.js';


export async function createQuery(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const userId = verifyId(req.body.userId);
		res = verifyIdentity(req.cookies.token, userId, res);
		const query = await service.createQuery(req.body.prompt, req.body.response, userId);
		console.log(query.response);
		res.json(query);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function deleteQuery(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		const query = await service.deleteQuery(id);
		res.json(query);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function getQueryById(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		const query = await service.getQuery(id);
		res.json(query);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function getAllQueries(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const querys = await service.getAllQueries();
		res.json(querys);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function editQuery(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.body.id);
		const query = await service.updateQuery(id, req.body.prompt, req.body.response);
		res.json(query);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}
