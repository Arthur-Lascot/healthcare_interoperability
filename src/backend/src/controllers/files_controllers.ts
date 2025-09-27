import { UUID } from "crypto";
import * as FileService from "../services/files_services"
import { Request, Response } from "express"
import { Role } from "../models/Roles";
import { ValidationError } from "../errors/AppError";

export const getFileController = async (req: Request, res: Response): Promise<Response> => {
    if (!req.role)
        throw new ValidationError("No role found for user")

    const uuid: UUID = req.params.uuid as UUID;
    const role: Role = req.role;

    const file: boolean = await FileService.getFile(role, uuid);

    return res.json(file);
}