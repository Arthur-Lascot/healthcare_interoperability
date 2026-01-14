import { UUID } from "crypto";
import { FileEntity } from "../DTO/FileEntity";
import { FileNotFoundError } from "../errors/FileNotFound";
import client from "../config/postgresClient";
import DocumentMOS from "../models/DocumentMOS";
import RendezVous from "../models/RendezVousMOS";
import Code from "../utils/structure/MOS/Code";
import axios from "axios";



export const getDocumentReferenceFromUUID = async (uuid: UUID): Promise<DocumentMOS> => {
    const result = await client.query(
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
    const code: Code = new Code(row.code_valeur, row.code_libelle, row.code_langue, row.code_identifiant_nomenclature, row.code_version_nomenclature);
    const metadonnee = {author: row.author, creationDate: row.creation_date, status: row.status, location: row.location, accessLogs: row.access_logs, rawFHIR: row.raw_fhir};
    const document: DocumentMOS = new DocumentMOS({typeDocument: code, meatdonnee: metadonnee});
    return document;
};

export const getAllFiles = async(): Promise<DocumentMOS[]> => {
    const result = await client.query(
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
      LEFT JOIN mos_document_metadonnee m ON d.metadonnee_id = m.id`,
    );

    let documents :DocumentMOS[] = [];
    for (const row of result.rows) {
        const code: Code = new Code(row.code_valeur, row.code_libelle, row.code_langue, row.code_identifiant_nomenclature, row.code_version_nomenclature);
        const metadonnee = {author: row.author, creationDate: row.creation_date, status: row.status, location: row.location, accessLogs: row.access_logs, rawFHIR: row.raw_fhir};
        documents.push(new DocumentMOS({typeDocument: code, meatdonnee: metadonnee}));
    }
    return documents;
};

export const insertMosCode = async (code: Code): Promise<string> => {
    const insertCodeQuery = `
        INSERT INTO mos_code (valeur, libelle, langue, identifiant_nomenclature, nom_nomenclature, version_nomenclature, uri_nomenclature)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id;
    `;
    const insertCodeValues = [
        code.valeur,
        code.libelle,
        code.langue,
        code.identifiantNomenclature,
        code.nomNomenclature,
        code.versionNomenclature,
        code.URINomenclature
    ];
    const codeResult = await client.query(insertCodeQuery, insertCodeValues);
    return codeResult.rows[0].id;;
};

export const insertMetadonnees = async (document: DocumentMOS): Promise<string> => {
    const insertMetadonneeQuery = `
        INSERT INTO mos_document_metadonnee (author, creation_date, status, location, access_logs, raw_fhir)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id;
    `;
    const metadonneeValues = [
        document.meatdonnee!.author,
        document.meatdonnee!.creationDate,
        document.meatdonnee!.status,
        document.meatdonnee!.location,
        document.meatdonnee!.accessLogs ? JSON.stringify(document.meatdonnee!.accessLogs) : null,
        document.meatdonnee!.rawFHIR ? JSON.stringify(document.meatdonnee!.rawFHIR) : null
    ];
    const metadonneeResult = await client.query(insertMetadonneeQuery, metadonneeValues);
    return metadonneeResult.rows[0].id;
}

export const insertDocumentMos = async (typeDocumentId: string, metadonneeId: string): Promise<string> => {
    const insertDocumentQuery = `
        INSERT INTO document_mos (type_document_id, metadonnee_id)
        VALUES ($1, $2)
        RETURNING id;
    `;
    const documentResult = await client.query(insertDocumentQuery, [typeDocumentId, metadonneeId])
    return documentResult.rows[0].id;
}

export const insertRendezVous = async (rendezVous: RendezVous, type_rdv_id: string, priorite_id: string, status_rdv_id: string): Promise<string> => {
    const insertRendezVousQuery = `
        INSERT INTO rendezvous_mos (id_rdv, type_rdv_id, date_prise_rdv, date_debut_rdv, date_fin_rdv, date_annulation_rdv, piece_jointe, priorite_id, titre_rdv, status_rdv_id, description_rdv, motif_rdv, commentaire)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id;
    `;
    const rdvValues = [
        rendezVous.idRdv,
        type_rdv_id,
        rendezVous.datePriseRdv,
        rendezVous.dateDebutRdv,
        rendezVous.dateFinRdv,
        rendezVous.dateAnnulationRdv,
        rendezVous.pieceJointe,
        priorite_id,
        rendezVous.titreRdv,
        status_rdv_id,
        rendezVous.descriptionRdv,
        rendezVous.motifRdv,
        rendezVous.commentaire
    ];

    const rdvResult = await client.query(insertRendezVousQuery, rdvValues);
    return rdvResult.rows[0].id;
}


export const getFileFromUrl = async (url: string): Promise<any> => {
    const result = await axios.get(url, { responseType: 'arraybuffer' });
    if (!result.data) {
        throw new FileNotFoundError(url);
    }
    return result;
}

