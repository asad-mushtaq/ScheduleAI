import { Request, Response } from 'express';

import { errorHandler } from '../services/errors.js';
import * as service from "../database/crud/task.js"
import { verifyId } from '../services/verify-params.js';


export async function createTask(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const eventId = verifyId(req.body.eventId);
		const task = await service.createTask(req.body.name, req.body.description, Boolean(JSON.parse(req.body.completed)), eventId);
		console.log(task.name);
		res.json(task);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		const task = await service.deleteTask(id);
		res.json(task);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function getTaskById(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		const task = await service.getTask(id);
		res.json(task);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function getAllTasks(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const tasks = await service.getAllTasks();
		res.json(tasks);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function editTask(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const task = await service.updateTask(req.body.id, req.body.name, req.body.description, Boolean(JSON.parse(req.body.completed)));
		res.json(task);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}
