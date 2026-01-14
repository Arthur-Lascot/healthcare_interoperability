import * as FileService from "../services/files_services"
import { Role } from "../utils/structure/FHIR/Roles";
import { ValidationError } from "../errors/AppError";
import { Request, Response } from "express";
import { UUID } from "crypto";
import DocumentReference from "../DTO/DocumentReference";
import DocumentReferenceToDocumentMOS from "../utils/mapping/DocumentReferenceToDocumentMOS";
import DocumentMOS from "../models/DocumentMOS";
import Bundle from "../DTO/Bundle";

export const getDocumentReferenceController = async (req: Request, res: Response): Promise<Response> => {
    
    if (!req.role) {
        req.log.warn({path: req.path}, 'No role found for user');
        throw new ValidationError("No role found for user");
    }

    const uuid: UUID = req.params.uuid as UUID;
    const role: Role = req.role;
    const file: DocumentMOS = await FileService.getDocumentReference(role, uuid);

    res.statusCode = 200;
    return res.json(file.meatdonnee?.rawFHIR);
}

export const getDocumentReferencesController = async (req: Request, res: Response): Promise<Response> => {
    if (!req.role) {
        req.log.warn({path: req.path}, 'No role found for user');
        throw new ValidationError("No role found for user");
    }

    const role: Role = req.role;
    const files: DocumentMOS[] = await FileService.getAllAccessibleFile(role);
    const bundle = new Bundle(
        {
            type: "searchset", 
            entry: files.map(file => {return { resource: file.meatdonnee?.rawFHIR , search: {mode: "match", score: 1}}}),
            total: files.length,
            timestamp: new Date()
    });
    res.statusCode = 200;
    return res.json(bundle);
}

export const createCRController = async (req: Request, res: Response): Promise<Response> => {

    if (!req.body || Object.keys(req.body).length === 0) {
        throw new ValidationError("Request body is empty or invalid");
    }

    const documentReference = new DocumentReference(req.body);
    const documentMOS = DocumentReferenceToDocumentMOS(documentReference);
    
    const newId = await FileService.createDocument(documentMOS);    
    return res.status(201).json({ status: "created", uuid: newId });
}