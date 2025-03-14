import express from 'express';
import "dotenv/config";
import bodyParser from "body-parser";
import "express-async-errors";
import { routes } from './routes/index.js';

const jsonParser = bodyParser.json();
const app = express();
  
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

export async function startApi() {

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

startApi();