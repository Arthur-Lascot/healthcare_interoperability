import * as FileRepository from "../repositories/file_repository"
import { Role } from "../models/Roles"
import { FileEntity } from "../entities/FileEntity"

const isReadableBy = (file: FileEntity, role: Role,): boolean => {
    if (!file.ReadableBy) return false;
    return file.ReadableBy[role];
}

export const getFile = (role: Role, fileUUID: string): boolean => {
    const file: FileEntity = FileRepository.getFileFromUUID(fileUUID);
    return isReadableBy(file, role);
}

export const getAllAccessibleFile = (role: Role): FileEntity[] => {
    const files: FileEntity[] = FileRepository.getAllFiles();
    let accessibleFiles: FileEntity[] = [];
    files.forEach((f: FileEntity) => { if (isReadableBy(f, role)) {accessibleFiles.push(f)} })
    return accessibleFiles;
}

export const createFile = async (file: FileEntity): Promise<number> => {
    return await FileRepository.createFile(file);
}