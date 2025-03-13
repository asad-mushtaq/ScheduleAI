import express from 'express';

import * as controller from '../controllers/users.js';

export const usersRoute = express.Router();
const routeUri = "/v1/users";


usersRoute.get(routeUri + "/:id", controller.getUserById);

usersRoute.get(routeUri, controller.getAllUsers);

usersRoute.get(routeUri + "/:id/events", controller.getUserEvents)

usersRoute.get(routeUri + "/:id/payments", controller.getUserPayments)

usersRoute.get(routeUri + "/:id/queries", controller.getUserQueries)

usersRoute.get(routeUri + "/:id/subscription", controller.getUserSubscription)


usersRoute.delete(routeUri + "/:id", controller.deleteUser);


usersRoute.patch(routeUri, controller.editUser);


usersRoute.post(routeUri, controller.createUser);

usersRoute.post(routeUri + "/login", controller.logIn);

