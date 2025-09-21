import { UUID } from "crypto";
import { NotFoundError } from "./AppError";

export class FileNotFoundError extends NotFoundError {
  constructor(uuid: UUID) {
    super(`File with UUID ${uuid} not found`);
    this.name = "FileNotFoundError";
  }
}