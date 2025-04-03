import express from 'express';

import * as controller from '../controllers/tasks.js';
import { verifyAdminJwt, verifyJwt } from '../services/verification.js';

export const tasksRoute = express.Router();
const routeUri = "/v1/tasks";


tasksRoute.get(routeUri + "/:id", verifyJwt, controller.getTaskById);

tasksRoute.get(routeUri, verifyAdminJwt, controller.getAllTasks);


tasksRoute.delete(routeUri + "/:id", verifyJwt, controller.deleteTask);

tasksRoute.patch(routeUri, verifyJwt, controller.editTask);

tasksRoute.post(routeUri, verifyJwt, controller.createTask);