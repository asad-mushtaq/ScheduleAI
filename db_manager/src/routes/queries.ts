import express from 'express';

import * as controller from '../controllers/queries.js';

export const queriesRoute = express.Router();
const routeUri = "/v1/queries";


queriesRoute.get(routeUri + "/:id", controller.getQueryById);

queriesRoute.get(routeUri, controller.getAllQuerys);


queriesRoute.delete(routeUri + "/:id", controller.deleteQuery);

queriesRoute.patch(routeUri, controller.editQuery);

queriesRoute.post(routeUri, controller.createQuery);