import { Role } from "../models/Roles";

declare module 'express-serve-static-core' {
  interface Request {
    role?: Role;
  }
}

export {}