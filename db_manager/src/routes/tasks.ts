import express from 'express';

import * as controller from '../controllers/tasks.js';

export const tasksRoute = express.Router();
const routeUri = "/v1/tasks";


tasksRoute.get(routeUri + "/:id", controller.getTaskById);

tasksRoute.get(routeUri, controller.getAllTasks);


tasksRoute.delete(routeUri + "/:id", controller.deleteTask);

tasksRoute.patch(routeUri, controller.editTask);

tasksRoute.post(routeUri, controller.createTask);