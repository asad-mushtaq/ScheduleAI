import express from 'express';

import * as controller from '../controllers/events.js';
import { verifyAdminJwt, verifyJwt } from '../services/verification.js';

export const eventsRoute = express.Router();
const routeUri = "/v1/events";


eventsRoute.get(routeUri + "/:id", verifyJwt, controller.getEventById);

eventsRoute.get(routeUri, verifyAdminJwt, controller.getAllEvents);

eventsRoute.get(routeUri + "/:id/tasks", verifyJwt, controller.getEventTasks);


eventsRoute.delete(routeUri + "/:id", verifyJwt, controller.deleteEvent);

eventsRoute.patch(routeUri, verifyJwt, controller.editEvent);

eventsRoute.post(routeUri, verifyJwt, controller.createEvent);