import { Request, Response } from 'express';

import { errorHandler } from '../services/errors.js';
import * as service from "../database/crud/event.js"
import { verifyId } from '../services/verify-params.js';


export async function createEvent(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const userId = verifyId(req.body.userId);
		const event = await service.createEvent(userId, req.body.name, req.body.description, new Date(req.body.startDate), +req.body.length);
		console.log(event.name);
		res.json(event);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function deleteEvent(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		const event = await service.deleteEvent(id);
		res.json(event);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function getEventById(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		const event = await service.getEvent(id);
		res.json(event);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function getAllEvents(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const events = await service.getAllEvents();
		res.json(events);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function getEventTasks(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		const tasks = await service.getEventTasks(id);
		let jsonTasks = Array();
		tasks.forEach(task => {
			jsonTasks.push(task.toJSON());
		});
		res.json(jsonTasks);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function editEvent(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const event = await service.updateEvent(req.body.id, req.body.name, req.body.description, new Date(req.body.startDate), +req.body.length);
		res.json(event);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}
