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
    ReadableByJob01: true,
    ReadableByJob02: false,
    ReadableByJob03: true,
    ReadableByJob04: false,
    ReadableByJob05: true,
    ReadableByJob06: false,
    ReadableByJob07: true,
    ReadableByJob08: false,
    ReadableByJob09: true,
    ReadableByJob10: false,
    ReadableByJob11: true,
    ReadableByJob12: false,
    ReadableByJob13: true,
    ReadableByJob14: false,
    ReadableByJob15: true,
    ReadableByJob16: false,
    ReadableByJob17: true,
    ReadableByJob18: false,
    ReadableByJob19: true
  },
  {
    uuid: "11111111-1111-1111-1111-111111111112",
    Code: 2,
    classCodeDisplayName: "Radiology Report",
    LOINC: 67890,
    typeCodeDisplayName: "DICOM",
    ReadableByJob01: false,
    ReadableByJob02: true,
    ReadableByJob03: false,
    ReadableByJob04: true,
    ReadableByJob05: false,
    ReadableByJob06: true,
    ReadableByJob07: false,
    ReadableByJob08: true,
    ReadableByJob09: false,
    ReadableByJob10: true,
    ReadableByJob11: false,
    ReadableByJob12: true,
    ReadableByJob13: false,
    ReadableByJob14: true,
    ReadableByJob15: false,
    ReadableByJob16: true,
    ReadableByJob17: false,
    ReadableByJob18: true,
    ReadableByJob19: false
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
