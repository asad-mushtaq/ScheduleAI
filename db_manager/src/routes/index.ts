import express from 'express';

import { usersRoute } from './users.js';
import { eventsRoute } from './events.js';
import { paymentsRoute } from './payments.js';
import { queriesRoute } from './queries.js';
import { subscriptionsRoute } from './subscriptions.js';
import { tasksRoute } from './tasks.js';

export const routes = express.Router();

routes.use(usersRoute);
routes.use(eventsRoute);
routes.use(paymentsRoute);
routes.use(queriesRoute);
routes.use(subscriptionsRoute);
routes.use(tasksRoute);
