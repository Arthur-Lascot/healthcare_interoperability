import { UUID } from "crypto";

export class FileNotFoundError extends Error {
  constructor(uuid: UUID) {
    super(`File with UUID ${uuid} not found`);
    this.name = "FileNotFoundError";
  }
}