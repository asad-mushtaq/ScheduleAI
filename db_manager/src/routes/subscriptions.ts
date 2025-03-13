import express from 'express';

import * as controller from '../controllers/subscriptions.js';

export const subscriptionsRoute = express.Router();
const routeUri = "/v1/subscriptions";


subscriptionsRoute.get(routeUri + "/:id", controller.getSubscriptionById);

subscriptionsRoute.get(routeUri, controller.getAllSubscriptions);


subscriptionsRoute.delete(routeUri + "/:id", controller.deleteSubscription);

subscriptionsRoute.patch(routeUri, controller.editSubscription);

subscriptionsRoute.post(routeUri, controller.createSubscription);