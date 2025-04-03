import express from 'express';

import * as controller from '../controllers/subscriptions.js';
import { verifyAdminJwt, verifyJwt } from '../services/verification.js';

export const subscriptionsRoute = express.Router();
const routeUri = "/v1/subscriptions";


subscriptionsRoute.get(routeUri + "/:id", verifyAdminJwt, controller.getSubscriptionById);

subscriptionsRoute.get(routeUri, verifyJwt, controller.getAllSubscriptions);


subscriptionsRoute.delete(routeUri + "/:id", verifyAdminJwt, controller.deleteSubscription);

subscriptionsRoute.patch(routeUri, verifyAdminJwt, controller.editSubscription);

subscriptionsRoute.post(routeUri, verifyAdminJwt, controller.createSubscription);