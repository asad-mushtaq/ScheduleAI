import { Request, Response } from 'express';

import { errorHandler } from '../services/errors.js';
import * as service from "../database/crud/payment.js"
import { verifyId, verifyAccess } from '../services/verification.js';


export async function createPayment(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		res = verifyAccess(req.cookies.token, req.body.userId, res);
		const payment = await service.createPayment(+req.body.amount, req.body.subscriptionId, req.body.userId);
		console.log(payment.amount);
		res.json(payment);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function deletePayment(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		res = verifyAccess(req.cookies.token, req.body.userId, res);
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
		res = verifyAccess(req.cookies.token, req.body.userId, res);
		const payments = await service.getAllPayments();
		res.json(payments);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}

export async function getPaymentById(req: Request, res: Response): Promise<void> {
	try {
		res.setHeader('Content-Type', 'application/json');
		res = verifyAccess(req.cookies.token, req.body.userId, res);
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
		res = verifyAccess(req.cookies.token, req.body.userId, res);
		const payment = await service.updatePayment(req.body.id, +req.body.amount, req.body.subscriptionId, req.body.userId);
		res.json(payment);
	} catch (error) {
		errorHandler(error as Error, res);
	}
}
