import { Role } from "../utils/structure/FHIR/Roles";

declare module 'express-serve-static-core' {
  interface Request {
    role?: Role;
  }
}

export {}