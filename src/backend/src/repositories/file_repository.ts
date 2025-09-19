import { UUID } from "crypto";
import { FileEntity } from "../entities/FileEntity";
import { FileNotFoundError } from "../errors/FileNotFound";

const files: FileEntity[] = [
  {
    uuid: "11111111-1111-1111-1111-111111111111",
    Code: 1,
    classCodeDisplayName: "Laboratory Report",
    LOINC: 12345,
    typeCodeDisplayName: "PDF",
    ReadableBy: [
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true
    ]
  },
  {
    uuid: "11111111-1111-1111-1111-111111111112",
    Code: 2,
    classCodeDisplayName: "Radiology Report",
    LOINC: 67890,
    typeCodeDisplayName: "DICOM",
    ReadableBy: [
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false
    ]
  }
];

export const fileExist = (uuid: UUID): boolean => {
    const file = files.find(f => f.uuid === uuid);
    if (file)
        return true;
    return false;
};

export const getFileFromUUID = (uuid: UUID): FileEntity => {
    const file = files.find(f => f.uuid === uuid);

    if (!file) {
        throw new FileNotFoundError(uuid);
    }

    return file;
};

export const createFile = (file: FileEntity): boolean => {
    files.push(file);
    return true;
}
