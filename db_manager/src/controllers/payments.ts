import { Request, Response } from 'express';

import { errorHandler } from '../services/errors.js';
import * as service from "../database/crud/payment.js"
import { verifyId, verifyIdentity } from '../services/verification.js';


export async function createPayment(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const subscriptionId = verifyId(req.body.subscriptionId);
		const userId = verifyId(req.body.userId);
		res = verifyIdentity(req.cookies.token, userId, res);
		const payment = await service.createPayment(+req.body.amount, subscriptionId, userId);
		console.log(payment.amount);
		res.json(payment);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function deletePayment(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		const payment = await service.deletePayment(id);
		res.json(payment);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function getAllPayments(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const payments = await service.getAllPayments();
		res.json(payments);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function getPaymentById(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.params.id);
		const payment = await service.getPayment(id);
		res.json(payment);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function editPayment(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		const id = verifyId(req.body.id);
		const subscriptionId = verifyId(req.body.subscriptionId);
		const userId = verifyId(req.body.userId);
		const payment = await service.updatePayment(id, +req.body.amount, subscriptionId, userId);
		res.json(payment);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}
