import express from 'express';
import { defaultRoute } from './default-route.js';
import { userRoute } from './user.js';

export const routes = express.Router();

routes.use(defaultRoute);

routes.use(userRoute);