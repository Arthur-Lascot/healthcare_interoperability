import * as FileRepository from "../repositories/file_repository"
import { Role } from "../models/Roles"
import { FileEntity } from "../entities/FileEntity"
import rawHabilitation from "../habilitation_matrix.json"
import { UUID } from "crypto";

const habilitation: Record<string, boolean[]> = rawHabilitation;

const isReadableBy = (file: FileEntity, role: Role,): boolean => {
    const accessList : boolean[] = habilitation[file.LOINC];
    return accessList[role];
}

export const getFile = async (role: Role, fileUUID: UUID): Promise<boolean> => {
    const file: FileEntity = await FileRepository.getFileFromUUID(fileUUID);
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