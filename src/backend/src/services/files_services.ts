import * as FileRepository from "../repositories/file_repository"
import { Role } from "../utils/structure/FHIR/Roles"
import rawHabilitation from "../habilitation_matrix.json"
import { UUID } from "crypto";
import DocumentMOS from "../models/DocumentMOS";
import RendezVous from "../models/RendezVousMOS";
import { ForbiddenError } from "../errors/AppError";
import ServiceRequestModel from "../models/ServiceRequestModel";
import axios from "axios";


const habilitation: Record<string, boolean[]> = rawHabilitation;

const isReadableBy = (document: DocumentMOS, role: Role,): boolean => {
    if (!document.typeDocument) {
        return true;
    }

    const accessList : boolean[] = habilitation[document.typeDocument?.valeur];
    return accessList[role];
}

export const getDocumentReference = async (role: Role, fileUUID: UUID): Promise<DocumentMOS> => {    
    const document: DocumentMOS = await FileRepository.getDocumentReferenceFromUUID(fileUUID);

    if (!isReadableBy(document, role)) {
        throw new ForbiddenError();
    }
    return document;
}

export const getAllAccessibleFile = async (role: Role): Promise<DocumentMOS[]> => {
    const files: DocumentMOS[] = await FileRepository.getAllFiles();
    let accessibleFiles: DocumentMOS[] = [];
    files.forEach((f: DocumentMOS) => { if (isReadableBy(f, role)) {accessibleFiles.push(f)} })
    return accessibleFiles;
}

export const createDocument = async (document: DocumentMOS): Promise<string> => {

    const urlToRetrieveFile = document.meatdonnee!.location!;
    const binary = await FileRepository.getFileFromUrl(urlToRetrieveFile);
    // appeller le repository qui permet de save dans la base vrai document

    const typeDocumentId = await FileRepository.insertMosCode(document.typeDocument!);
    const metadonneeId = await FileRepository.insertMetadonnees(document);
    const documentId = await FileRepository.insertDocumentMos(typeDocumentId, metadonneeId);

    return documentId;
}

export const createRendezVous = async (rendezVous: RendezVous): Promise<string> => {
    const type_rdv_id = await FileRepository.insertMosCode(rendezVous.typeRdv!);
    const priorite_id = await FileRepository.insertMosCode(rendezVous.priorite!);
    const status_rdv_id = await FileRepository.insertMosCode(rendezVous.statusRdv!);

    const rdvId = await FileRepository.insertRendezVous(rendezVous, type_rdv_id, priorite_id, status_rdv_id);
    return rdvId;
}

export const transfertAnalyseRequest = async (serviceRequestModel: ServiceRequestModel): Promise<void> => {
    const urlToSendFile = ''; //FIXME
    await axios.post(urlToSendFile, serviceRequestModel);
}