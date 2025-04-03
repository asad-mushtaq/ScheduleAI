import express from 'express';

import * as controller from '../controllers/payments.js';
import { verifyAdminJwt, verifyJwt } from '../services/verification.js';

export const paymentsRoute = express.Router();
const routeUri = "/v1/payments";


paymentsRoute.get(routeUri + "/:id", verifyJwt, controller.getPaymentById);

paymentsRoute.get(routeUri, verifyAdminJwt, controller.getAllPayments);


paymentsRoute.delete(routeUri + "/:id", verifyJwt, controller.deletePayment);

paymentsRoute.patch(routeUri, verifyJwt, controller.editPayment);

paymentsRoute.post(routeUri, verifyJwt, controller.createPayment);