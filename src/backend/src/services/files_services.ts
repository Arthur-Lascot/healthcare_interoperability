import * as FileRepository from "../repositories/file_repository"
import { Role } from "../models/Roles"
import { UUID } from "crypto"
import { FileEntity } from "../entities/FileEntity"

const isReadableBy = (file: FileEntity, role: Role,): boolean => {
    return file.ReadableBy[role];
}

export const getFile = (role: Role, fileUUID: UUID): boolean => {
    const file: FileEntity = FileRepository.getFileFromUUID(fileUUID);
    return isReadableBy(file, role);
}

export const getAllAccessibleFile = (role: Role): FileEntity[] => {
    const files: FileEntity[] = FileRepository.getAllFiles();
    let accessibleFiles: FileEntity[] = [];
    files.forEach((f: FileEntity) => { if (isReadableBy(f, role)) {accessibleFiles.push(f)} })
    return accessibleFiles;
}