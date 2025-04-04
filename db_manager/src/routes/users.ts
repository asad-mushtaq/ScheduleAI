import express from 'express';

import * as controller from '../controllers/users.js';
import { verifyAdminJwt, verifyJwt } from '../services/verification.js';

export const usersRoute = express.Router();
const routeUri = "/v1/users";
const adminUri = "/v1/admin/users";

usersRoute.get(routeUri + "", verifyAdminJwt, controller.getAllUsers);

usersRoute.get(routeUri + "/:id", verifyJwt, controller.getUserById);

usersRoute.get(routeUri + "/:id/events", verifyJwt, controller.getUserEvents)

usersRoute.get(routeUri + "/:id/payments", verifyJwt, controller.getUserPayments)

usersRoute.get(routeUri + "/:id/queries", verifyJwt, controller.getUserQueries)

usersRoute.get(routeUri + "/:id/subscription", verifyJwt, controller.getUserSubscription)


usersRoute.delete(routeUri + "/:id", verifyJwt, controller.deleteUser);


usersRoute.patch(routeUri + "/:id", verifyJwt, controller.editUser);


usersRoute.post(routeUri, controller.createUser);

usersRoute.post(adminUri, verifyAdminJwt, controller.createAdminUser);

usersRoute.post(routeUri + "/login", controller.logIn);

