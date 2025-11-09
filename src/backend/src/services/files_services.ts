import * as FileRepository from "../repositories/file_repository"
import { Role } from "../utils/structure/FHIR/Roles"
import { FileEntity } from "../DTO/FileEntity"
import rawHabilitation from "../habilitation_matrix.json"
import { UUID } from "crypto";
import { getLogger } from "../logger/loggerContext";


const habilitation: Record<string, boolean[]> = rawHabilitation;

const isReadableBy = (file: FileEntity, role: Role,): boolean => {

    const accessList : boolean[] = habilitation[file.loinc];
    return accessList[role];
}

export const getDocumentReference = async (role: Role, fileUUID: UUID): Promise<boolean> => {    
    const file: FileEntity = await FileRepository.getDocumentReferenceFromUUID(fileUUID);
    return isReadableBy(file, role);
}

export const getAllAccessibleFile = async (role: Role): Promise<FileEntity[]> => {
    const files: FileEntity[] = await FileRepository.getAllFiles();
    let accessibleFiles: FileEntity[] = [];
    files.forEach((f: FileEntity) => { if (isReadableBy(f, role)) {accessibleFiles.push(f)} })
    return accessibleFiles;
}

export const createFile = async (file: FileEntity): Promise<number> => {
    return await FileRepository.createFile(file);
}