import express from 'express';

import * as controller from '../controllers/queries.js';
import { verifyAdminJwt, verifyJwt } from '../services/verification.js';

export const queriesRoute = express.Router();
const routeUri = "/v1/queries";


queriesRoute.get(routeUri + "/:id", verifyJwt, controller.getQueryById);

queriesRoute.get(routeUri, verifyAdminJwt, controller.getAllQueries);


queriesRoute.delete(routeUri + "/:id", verifyJwt, controller.deleteQuery);

queriesRoute.patch(routeUri, verifyJwt, controller.editQuery);

queriesRoute.post(routeUri, verifyJwt, controller.createQuery);