import express from 'express';
import "dotenv/config";
import bodyParser from "body-parser";
import "express-async-errors";
import { routes } from './routes/index.js';
import cookieParser from 'cookie-parser';

const jsonParser = bodyParser.json();
const app = express();
  
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", `http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`);
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

export async function startApi() {
  app.use(cookieParser());
  app.use(jsonParser);
  app.use('/', routes);

  if (process.env.DB_MANAGER_PORT === undefined) {
    throw new Error("DB_MANAGER_PORT in environment missing, terminating.");
  }

  app.listen(process.env.DB_MANAGER_PORT, () =>
    console.log(`server running : http://${process.env.DB_MANAGER_HOST}:${process.env.DB_MANAGER_PORT}`),
  );
}

startApi();