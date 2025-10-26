import { AsyncLocalStorage } from "async_hooks";
import { Request, Response, NextFunction } from "express";
import logger from "../logger/logger";

type Store = {
  logger?: import("pino").Logger;
  requestId?: string;
};

export const asyncLocalStorage = new AsyncLocalStorage<Store>();

export function alsMiddleware(req: Request, res: Response, next: NextFunction) {
  const reqLogger: import("pino").Logger = req.log;

  const store: Store = {
    logger: reqLogger
  };

  asyncLocalStorage.run(store, () => next());
}
