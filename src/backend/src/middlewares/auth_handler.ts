import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: process.env.KEYCLOAK_JWKS_URI as string,
});

function getKey(header: any, callback: (err: Error | null, key?: string) => void) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err || !key) {
      return callback(err || new Error("No signing key found"));
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.log.info({path: req.path}, "Missing authorization header");
    return res.status(401).json({ error: "Missing authorization header" });
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded: any) => {
    if (err) {
      req.log.warn({err, path: req.path}, "Token not valid");
      return res.status(401).json({ error: "Token not valid" });
    }

    req.role = decoded.realm_access?.roles || [];
    next();
  });
};
