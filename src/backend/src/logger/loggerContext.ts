import logger from "./logger";
import { asyncLocalStorage } from "../middlewares/als";

export function getLogger(): import("pino").Logger {
  const store = asyncLocalStorage.getStore();
  if (store && store.logger) return store.logger;
  return logger;
}

export function getRequestContext() {
  const store = asyncLocalStorage.getStore();
  return {
    requestId: store?.requestId,
  };
}
