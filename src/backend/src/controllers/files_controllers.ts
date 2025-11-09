import * as FileService from "../services/files_services"
import { Role } from "../utils/structure/FHIR/Roles";
import { ValidationError } from "../errors/AppError";
import { FileEntity } from "../DTO/FileEntity";
import { Request, Response } from "express";
import { UUID } from "crypto";

export const getDocumentReferenceController = async (req: Request, res: Response): Promise<Response> => {
    
    if (!req.role) {
        req.log.warn({path: req.path}, 'No role found for user');
        throw new ValidationError("No role found for user");
    }

    const uuid: UUID = req.params.uuid as UUID;
    const role: Role = req.role;
    const file: boolean = await FileService.getDocumentReference(role, uuid);

    res.statusCode = 200;
    return res.json(file);
}

export const createFileController = async (req: any, res: any) => {

    const body = req.body as Partial<FileEntity>;

    if (!body || body.code === undefined || !body.classCodeDisplayName || body.loinc === undefined || !body.typeCodeDisplayName) {
        throw new ValidationError("Missing or invalid fields in request body");
    }

    // content is optional, so we don't validate it

    const newId = await FileService.createFile(body as FileEntity);
    
    res.statusCode = 201;
    return res.status(201).json({ status: "created", uuid: newId });
}