import * as FileRepository from "../repositories/file_repository"
import { Role } from "../utils/structure/FHIR/Roles"
import rawHabilitation from "../habilitation_matrix.json"
import { UUID } from "crypto";
import { asyncLocalStorage } from "../middlewares/als";
import DocumentMOS from "../models/DocumentMOS";
import { ForbiddenError } from "../errors/AppError";


const habilitation: Record<string, boolean[]> = rawHabilitation;

const isReadableBy = (document: DocumentMOS, role: Role,): boolean => {
    if (!document.typeDocument) {
        return true;
    }

    const accessList : boolean[] = habilitation[document.typeDocument?.valeur];
    return accessList[role];
}

export const getDocumentReference = async (role: Role, fileUUID: UUID): Promise<DocumentMOS> => {    
    const document: DocumentMOS = await FileRepository.getDocumentReferenceFromUUID(fileUUID);

    if (!isReadableBy(document, role)) {
        throw new ForbiddenError();
    }
    return document;
}

/*export const getAllAccessibleFile = async (role: Role): Promise<FileEntity[]> => {
    const files: FileEntity[] = await FileRepository.getAllFiles();
    let accessibleFiles: FileEntity[] = [];
    files.forEach((f: FileEntity) => { if (isReadableBy(f, role)) {accessibleFiles.push(f)} })
    return accessibleFiles;
}*/

export const createDocument = async (document: DocumentMOS): Promise<string> => {
    const typeDocumentId = await FileRepository.insertMosCode(document);
    const metadonneeId = await FileRepository.insertMetadonnees(document);
    const documentId = await FileRepository.insertDocumentMos(typeDocumentId, metadonneeId);

    return documentId;
}