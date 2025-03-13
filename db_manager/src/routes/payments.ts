import express from 'express';

import * as controller from '../controllers/payments.js';

export const paymentsRoute = express.Router();
const routeUri = "/v1/payments";


paymentsRoute.get(routeUri + "/:id", controller.getPaymentById);

paymentsRoute.get(routeUri, controller.getAllPayments);


paymentsRoute.delete(routeUri + "/:id", controller.deletePayment);

paymentsRoute.patch(routeUri, controller.editPayment);

paymentsRoute.post(routeUri, controller.createPayment);