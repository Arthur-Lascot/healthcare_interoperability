import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const headerName = "x-request-id";
  const id = req.header(headerName) || uuidv4();

  req.headers[headerName] = id;
  res.setHeader(headerName, id);
  
  (req as any).requestId = id;
  next();
}
