import express from 'express';

import * as controller from '../controllers/users.js';

export const usersRoute = express.Router();
const routeUri = "/v1/users";


usersRoute.get(routeUri + "/:id", controller.getUserById);

usersRoute.delete(routeUri + "/:id", controller.deleteUser);

usersRoute.patch(routeUri, controller.editUser);

usersRoute.post(routeUri, controller.createUser);
// admin
usersRoute.get(routeUri, controller.getAllUsers);