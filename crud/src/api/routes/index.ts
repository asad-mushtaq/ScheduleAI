import express from 'express';

import { usersRoute } from './users.js';

export const routes = express.Router();

routes.use(usersRoute);