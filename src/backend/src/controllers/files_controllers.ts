import { UUID } from "crypto";
import * as FileService from "../services/files_services"
import { Request, Response } from "express"
import { Role } from "../models/Roles";
import { RoleNotFoundError } from "../errors/RoleNotFound";

export const getFileController = (req: Request, res: Response) => {
    if (!req.role)
        throw new RoleNotFoundError

    const uuid: UUID = req.params.uuid as UUID;
    const role: Role = req.role;

    const file = FileService.getFile(role, uuid);
    
    return res.json(file);
}