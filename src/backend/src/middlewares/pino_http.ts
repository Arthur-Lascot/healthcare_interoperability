import pinoHttp from "pino-http";
import logger from "../logger/logger";
import { stdSerializers } from "pino";

const pinoMiddleware = pinoHttp({
  logger,
  genReqId: (req: any) => {
    return req.headers["x-request-id"] || undefined;
  },

  customLogLevel: (res: any, err: any) => {
    if (res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  
  serializers: {
    req: (req: any) => ({
      method: req.method,
      url: req.url,
      id: req.id || req.headers["x-request-id"],
      params: req.params,
      query: req.query,
    }),

    res: stdSerializers.res,
    err: stdSerializers.err
  }
});

export default pinoMiddleware;
