import * as FileService from "../services/files_services"
import { Role } from "../models/Roles";
import { ValidationError } from "../errors/AppError";
import { FileEntity } from "../entities/FileEntity";
import { Request, Response } from "express";
import { UUID } from "crypto";

export const getFileController = async (req: Request, res: Response): Promise<Response> => {
    if (!req.role)
        throw new ValidationError("No role found for user")

    const uuid: UUID = req.params.uuid as UUID;
    const role: Role = req.role;

    const file: boolean = await FileService.getFile(role, uuid);

    return res.json(file);
}

export const createFileController = async (req: any, res: any) => {

    const body = req.body as Partial<FileEntity>;

    if (!body || body.code === undefined || !body.classCodeDisplayName || body.LOINC === undefined || !body.typeCodeDisplayName) {
        throw new ValidationError("Missing or invalid fields in request body");
    }

    // content is optional, so we don't validate it

    const newId = await FileService.createFile(body as FileEntity);

    return res.status(201).json({ status: "created", uuid: newId });
}