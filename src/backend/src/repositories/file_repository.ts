import { UUID } from "crypto";
import { FileEntity } from "../DTO/FileEntity";
import { FileNotFoundError } from "../errors/FileNotFound";
import { Pool } from "pg";
import DocumentMOS from "../models/DocumentMOS";
import Code from "../utils/structure/MOS/Code";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const getDocumentReferenceFromUUID = async (uuid: UUID): Promise<DocumentMOS> => {
    const result = await pool.query(
      `SELECT 
        d.id AS document_id,
        c.valeur AS code_valeur,
        c.libelle AS code_libelle,
        c.langue AS code_langue,
        c.identifiant_nomenclature AS code_identifiant_nomenclature,
        c.nom_nomenclature AS code_nom_nomenclature,
        c.version_nomenclature AS code_version_nomenclature,
        c.uri_nomenclature AS code_uri_nomenclature,
        c.identifiant_agence AS code_identifiant_agence,
        c.nom_agence AS code_nom_agence,
        m.id AS metadonnee_id,
        m.author,
        m.creation_date,
        m.status,
        m.location,
        m.access_logs,
        m.raw_fhir
      FROM document_mos d
      LEFT JOIN mos_code c ON d.type_document_id = c.id
      LEFT JOIN mos_document_metadonnee m ON d.metadonnee_id = m.id
      WHERE d.id = $1
      LIMIT 1;`,
      [uuid]
    );

    if (result.rows.length === 0) {
        throw new FileNotFoundError(uuid);
    }

    const row = result.rows[0];
    const code: Code = new Code({code: row.code_valeur, display: row.code_libelle, system: row.code_identifiant_nomenclature, version: row.code_version_nomenclature}, row.code_langue);
    const metadonnee = {author: row.author, creationDate: row.creation_date, status: row.status, location: row.location, accessLogs: row.access_logs, rawFHIR: row.raw_fhir};
    const document: DocumentMOS = new DocumentMOS({typeDocument: code, meatdonnee: metadonnee});

    return document;
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
