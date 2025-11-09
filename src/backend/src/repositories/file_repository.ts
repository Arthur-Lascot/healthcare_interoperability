import { UUID } from "crypto";
import { FileEntity } from "../DTO/FileEntity";
import { FileNotFoundError } from "../errors/FileNotFound";
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const getDocumentReferenceFromUUID = async (uuid: UUID): Promise<FileEntity> => {
    const result = await pool.query(
      "SELECT * FROM documents WHERE uuid = $1;",
      [uuid]
    );

    if (result.rows.length === 0) {
        throw new FileNotFoundError(uuid);
    }
    return result.rows[0];
};

export const getAllFiles = async(): Promise<FileEntity[]> => {
    const result = await pool.query(
      "SELECT * FROM documents",
    );

    return result.rows;
};

export const createFile = async (file: FileEntity): Promise<number> => {
    const result = await pool.query(
        `INSERT INTO documents (code, class_code_display_name, loinc, type_code_display_name, content)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING uuid`,
        [
            file.code,
            file.classCodeDisplayName,
            file.loinc,
            file.typeCodeDisplayName,
            file.content || null
        ]
    );
    return result.rows[0].uuid as number;
}
