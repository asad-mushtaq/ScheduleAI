import express, { NextFunction, Request, Response } from 'express';
import "dotenv/config";
import bodyParser from "body-parser";
import "express-async-errors";
import { errorHandler } from './middlewares/errors.js';
import * as controller from './controller.js';

const jsonParser = bodyParser.json();
const routeUri = "/api/v1/users";

export async function startApi() {
  const app = express();

  app.use(jsonParser);

  app.get(routeUri + "/:id", controller.getUserById);

  app.delete(routeUri + "/:id", controller.deleteUser);

  app.patch(routeUri, controller.editUser);

  app.post(routeUri, controller.createUser);

  // admin
  app.get(routeUri, controller.getAllUsers);
  // app.use(errorHandler);

  if (process.env.PORT === undefined) {
    throw new Error("PORT in .env file missing, terminating.");
  }

  app.listen(process.env.PORT, () =>
    console.log(`server running : http://localhost:${process.env.PORT}`),
  );
}