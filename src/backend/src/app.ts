import express from "express";
import cors from "cors";
import file_routes from "./routes/files.routes";
import { authMiddleware } from "./middlewares/auth_handler";
import { errorHandler } from "./middlewares/error_handler";
import { NotFoundError } from "./errors/AppError";
import { requestIdMiddleware } from "./middlewares/request_id";
import pinoMiddleware from "./middlewares/pino_http";
import { alsMiddleware } from "./middlewares/als";

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://frontend:3000',
    'http://localhost:3002' // Add this line to allow requests from port 3002
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(requestIdMiddleware);
app.use(pinoMiddleware);
app.use(alsMiddleware);

app.use(authMiddleware)

app.use("/api", file_routes);

app.use((req, res, next) => {
  const err = new NotFoundError(`Cannot find ${req.originalUrl} on this server`);
  next(err);
});

app.use(errorHandler);

export default app;