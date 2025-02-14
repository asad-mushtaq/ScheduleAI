import express from "express";
import { routes } from './routes/index.js';
import "dotenv/config";

export async function startApi() {
  const app = express();

  app.use('/', routes);
  
  app.listen(process.env.PORT, () =>
    console.log(`server running : http://localhost:${process.env.PORT}`),
  );
}