import { UUID } from "crypto";

export class RoleNotFoundError extends Error {
  constructor() {
    super(`No role found for user`);
    this.name = "RoleNotFoundError";
  }
}