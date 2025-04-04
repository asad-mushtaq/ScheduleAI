import { Request, Response } from 'express';

import { errorHandler } from '../services/errors.js';
import * as service from "../database/crud/subscription.js"
import { verifyId } from '../services/verification.js';


export async function createSubscription(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const subscription = await service.createSubscription(req.body.name, +req.body.priceUsd, +req.body.queryLimit);
		console.log(subscription.name);
		res.json(subscription);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function deleteSubscription(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		const subscription = await service.deleteSubscription(id);
		res.json(subscription);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function getSubscriptionById(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		const subscription = await service.getSubscription(id);
		res.json(subscription);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function getAllSubscriptions(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const subscriptions = await service.getAllSubscriptions();
		res.json(subscriptions);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function editSubscription(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.body.id);
		const subscription = await service.updateSubscription(id, req.body.name, +req.body.priceUsd, +req.body.queryLimit);
		res.json(subscription);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}
