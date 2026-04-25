import express, { type Request, type Response } from "express";

import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.STATUS! === "DEV" ? "http://localhost:3000" : process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(cookieParser());

app.use(
  morgan(
    "\x1b[36m:date[web]\x1b[0m \x1b[33m:method\x1b[0m (\x1b[34m:url\x1b[0m) Status[\x1b[32m:status\x1b[0m] - [\x1b[35m:response-time ms\x1b[0m]"
  )
);

import { errorHandler } from "./middlewares/errorHandler.ts";

app.get("/", (req: Request, res: Response) => {
  res.send("server is up!!");
});

app.use(errorHandler);

export default app;
