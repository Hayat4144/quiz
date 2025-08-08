import { httpStatus } from "@customtype/http";
import ErrorMiddleware from "@middlewares/error-middleware";
import express, { type Express, Request, Response } from "express";
import morgan from "morgan";

const startServer = (): Express => {
  const app = express();

  app.use(morgan("tiny"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.disable("x-powered-by");

  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
      status: httpStatus.SUCCESS,
      message: "Pragya Ecom is running",
    });
  });

  app.use(ErrorMiddleware);

  return app;
};

export default startServer;
