import { FileEntity } from "../entities/FileEntity";
import { FileNotFoundError } from "../errors/FileNotFound";
import { pool } from "../db";

const files: FileEntity[] = [
  {
    uuid: "1",
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
    uuid: "2",
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

export const fileExist = (uuid: string): boolean => {
    const file = files.find(f => f.uuid === uuid);
    if (file)
        return true;
    return false;
};

export const getFileFromUUID = (uuid: string): FileEntity => {
    const file = files.find(f => f.uuid === uuid);

    if (!file) {
        throw new FileNotFoundError(uuid);
    }

    return file;
};

export const getAllFiles = (): FileEntity[] => {
    return files;
}

export const createFile = async (file: FileEntity): Promise<number> => {
    const result = await pool.query(
        `INSERT INTO documents (code, class_code_display_name, loinc, type_code_display_name)
         VALUES ($1, $2, $3, $4)
         RETURNING uuid`,
        [
            file.Code,
            file.classCodeDisplayName,
            file.LOINC,
            file.typeCodeDisplayName
        ]
    );
    return result.rows[0].uuid as number;
}
