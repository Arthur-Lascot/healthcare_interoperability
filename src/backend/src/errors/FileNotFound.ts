import { NotFoundError } from "./AppError";

export class FileNotFoundError extends NotFoundError {
  constructor(uuid: string) {
    super(`File with UUID ${uuid} not found`);
    this.name = "FileNotFoundError";
  }
}