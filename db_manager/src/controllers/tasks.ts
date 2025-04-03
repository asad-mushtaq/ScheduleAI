import { Request, Response } from 'express';

import { errorHandler } from '../services/errors.js';
import * as service from "../database/crud/task.js"
import { getEvent } from '../database/crud/event.js';
import { verifyId, verifyIdentity } from '../services/verification.js';



export async function createTask(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const eventId = verifyId(req.body.eventId);
		const userId = (await getEvent(eventId)).userId;
		res = verifyIdentity(req.cookies.token, userId, res);
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
		const task = await service.getTask(id)
		const userId = (await getEvent(task.eventId)).userId;
		res = verifyIdentity(req.cookies.token, userId, res);
		const deletedTask = await service.deleteTask(id);
		res.json(deletedTask);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function getTaskById(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		const task = await service.getTask(id)
		const userId = (await getEvent(task.eventId)).userId;
		res = verifyIdentity(req.cookies.token, userId, res);
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
		const id = verifyId(req.body.id);
		const task = await service.getTask(id)
		const userId = (await getEvent(task.eventId)).userId;
		res = verifyIdentity(req.cookies.token, userId, res);
		const Editedtask = await service.updateTask(req.body.id, req.body.name, req.body.description, Boolean(JSON.parse(req.body.completed)));
		res.json(Editedtask);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}
