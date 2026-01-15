import { Role } from "../utils/structure/FHIR/Roles";

declare module 'express-serve-static-core' {
  interface Request {
    role?: Role;
    userId?: string;
    file?: Express.Multer.File;
  }
}

export {}