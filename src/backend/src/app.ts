import express from "express";
import cors from "cors";
import file_routes from "./routes/files.routes";
import pdf_routes from "./routes/pdf.routes";
import { authMiddleware } from "./middlewares/auth_handler";
import { errorHandler } from "./middlewares/error_handler";
import { NotFoundError } from "./errors/AppError";
import { requestIdMiddleware } from "./middlewares/request_id";
import pinoMiddleware from "./middlewares/pino_http";
import { alsMiddleware } from "./middlewares/als";

const app = express();

const corsOptions = {
  origin: [
    'http://frontend1:3010',
    'http://frontend2:3011',
    'http://frontend3:3012',
    'http://backend2:3003',
    'http://backend3:3004',
    'http://backend1:3005',
    'http://localhost:3010',
    'http://localhost:3011',
    'http://localhost:3012',
    'http://localhost:3003',
    'http://loacalhost:3004',
    'http://localhost:3005'
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
app.use("/api/pdf", pdf_routes);

app.use((req, res, next) => {
  const err = new NotFoundError(`Cannot find ${req.originalUrl} on this server`);
  next(err);
});

app.use(errorHandler);

export default app;