import express from 'express';

import * as controller from '../controllers/events.js';

export const eventsRoute = express.Router();
const routeUri = "/v1/events";


eventsRoute.get(routeUri + "/:id", controller.getEventById);

eventsRoute.get(routeUri, controller.getAllEvents);

eventsRoute.get(routeUri + "/:id/tasks", controller.getEventTasks);


eventsRoute.delete(routeUri + "/:id", controller.deleteEvent);

eventsRoute.patch(routeUri, controller.editEvent);

eventsRoute.post(routeUri, controller.createEvent);