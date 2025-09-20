import express from "express";
import file_routes from "./routes/files.routes";
import { authMiddleware } from "./middlewares/auth_handler";
import { errorHandler } from "./middlewares/error_handler";
import { NotFoundError } from "./errors/AppError";

const app = express();

app.use(express.json());

//app.use("/api", user_routes);

app.use(authMiddleware);

app.use("/api", file_routes);

app.all('*', (req, res, next) => {
  const err = new NotFoundError(`Cannot find ${req.originalUrl} on this server`);
  next(err);
});

app.use(errorHandler);

export default app;