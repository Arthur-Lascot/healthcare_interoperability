import * as FileRepository from "../repositories/file_repository"
import { Role } from "../utils/structure/FHIR/Roles"
import { FileEntity } from "../DTO/FileEntity"
import rawHabilitation from "../habilitation_matrix.json"
import { UUID } from "crypto";
import { getLogger } from "../logger/loggerContext";
import DocumentMOS from "../models/DocumentMOS";


const habilitation: Record<string, boolean[]> = rawHabilitation;

const isReadableBy = (document: DocumentMOS, role: Role,): boolean => {

    if (!document.typeDocument) {
        return true;
    }

    const accessList : boolean[] = habilitation[document.typeDocument?.valeur];
    return accessList[role];
}

export const getDocumentReference = async (role: Role, fileUUID: UUID): Promise<boolean> => {    
    const document: DocumentMOS = await FileRepository.getDocumentReferenceFromUUID(fileUUID);
    return isReadableBy(document, role);
}

/*export const getAllAccessibleFile = async (role: Role): Promise<FileEntity[]> => {
    const files: FileEntity[] = await FileRepository.getAllFiles();
    let accessibleFiles: FileEntity[] = [];
    files.forEach((f: FileEntity) => { if (isReadableBy(f, role)) {accessibleFiles.push(f)} })
    return accessibleFiles;
}*/

export const createFile = async (file: FileEntity): Promise<number> => {
    return await FileRepository.createFile(file);
}