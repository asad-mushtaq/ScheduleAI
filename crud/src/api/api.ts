import express, { NextFunction, Request, Response } from 'express';
import "dotenv/config";
import bodyParser from "body-parser";
import "express-async-errors";
import { routes } from './routes/index.js';
import * as controller from './controllers/users.js';

const jsonParser = bodyParser.json();
const routeUri = "/api/v1/users";

export async function startApi() {
  const app = express();
  
  app.use(jsonParser);
  app.use(jsonParser);
  app.use('/', routes);
  // app.use(errorHandler);

  if (process.env.PORT === undefined) {
    throw new Error("PORT in .env file missing, terminating.");
  }

  app.listen(process.env.PORT, () =>
    console.log(`server running : http://localhost:${process.env.PORT}`),
  );
}