import * as FileService from "../services/files_services"
import { Role } from "../utils/structure/FHIR/Roles";
import { ValidationError } from "../errors/AppError";
import { Application, Request, Response } from "express";
import { UUID } from "crypto";
import DocumentReference from "../DTO/DocumentReference";
import DocumentReferenceToDocumentMOS from "../utils/mapping/DocumentReferenceToDocumentMOS";
import DocumentMOS from "../models/DocumentMOS";
import Bundle from "../DTO/Bundle";
import Resource from "../DTO/Resource";
import BundleCollectionToResourcesList from "../utils/mapping/BundleCollectionToResourcesList";
import ServiceRequest from "../DTO/ServiceRequest";
import Appointment from "../DTO/Appointment";
import AppointmentToRendezVous from "../utils/mapping/AppointmentToRendezVous";
import ServiceRequestModel from "../models/ServiceRequestModel";
import BundleModel from "../models/BundleModel";

export const getDocumentReferenceController = async (req: Request, res: Response): Promise<Response> => {
    
    if (!req.role) {
        req.log.warn({path: req.path}, 'No role found for user');
        throw new ValidationError("No role found for user");
    }

    const uuid: UUID = req.params.uuid as UUID;
    const role: Role = req.role;
    const file: DocumentMOS = await FileService.getDocumentReference(role, uuid);

    res.statusCode = 200;
    return res.json(file.meatdonnee?.rawFHIR);
}

export const getDocumentReferencesController = async (req: Request, res: Response): Promise<Response> => {
    if (!req.role) {
        req.log.warn({path: req.path}, 'No role found for user');
        throw new ValidationError("No role found for user");
    }

    const role: Role = req.role;
    const files: DocumentMOS[] = await FileService.getAllAccessibleDocumentReference(role);
    const bundle = new Bundle(
        {
            type: "searchset", 
            entry: files.map(file => {return { resource: file.meatdonnee?.rawFHIR , search: {mode: "match", score: 1}}}),
            total: files.length,
            timestamp: new Date()
    });
    res.statusCode = 200;
    return res.json(bundle);
}

export const createCRController = async (req: Request, res: Response): Promise<Response> => {
    const documentReference = new DocumentReference(req.body);
    const documentMOS = DocumentReferenceToDocumentMOS(documentReference);
    
    const newId = await FileService.createDocument(documentMOS);    
    return res.status(201).json({ status: "created", uuid: newId });
}

export const TransfertAnalyseRequestController = async (req: Request, res: Response): Promise<void> => {
    const bundle = new Bundle(req.body);
    let resourcesList: Resource[] = await BundleCollectionToResourcesList(bundle);

    for (const resource of resourcesList) {
        if (resource.resourceType === "DocumentReference") {
            const documentReference = resource as DocumentReference;
            const documentMOS = DocumentReferenceToDocumentMOS(documentReference);
            await FileService.createDocument(documentMOS);
        }
        else if (resource.resourceType === "serviceRequest") {
            const serviceRequest = resource as ServiceRequest;
            const serviceRequestModel = new ServiceRequestModel(serviceRequest);
            // Could save it as well
        }
        else if (resource.resourceType === "Appointment") {
            const appointment = resource as Appointment;
            const rendezVousMOS = AppointmentToRendezVous(appointment);
            await FileService.createRendezVous(rendezVousMOS);
        }
    }
    const response = await FileService.transfertAnalyseRequest(new BundleModel(bundle));
    res.status(response.status);
    response.data.pipe(res);
}

export const AnalyseController = async (req: Request, res: Response): Promise<void> => {
    const bundle = new Bundle(req.body);
    let resourcesList: Resource[] = await BundleCollectionToResourcesList(bundle);

    for (const resource of resourcesList) {
        if (resource.resourceType === "DocumentReference") {
            const documentReference = resource as DocumentReference;
            const documentMOS = DocumentReferenceToDocumentMOS(documentReference);
            await FileService.createDocument(documentMOS);
        }
        else if (resource.resourceType === "serviceRequest") {
            const serviceRequest = resource as ServiceRequest;
            const serviceRequestModel = new ServiceRequestModel(serviceRequest);
            // Could save it as well
        }
        else if (resource.resourceType === "Appointment") {
            const appointment = resource as Appointment;
            const rendezVousMOS = AppointmentToRendezVous(appointment);
            await FileService.createRendezVous(rendezVousMOS);
        }
    }

    const hardcodePathTofile = '----'
    const stream = await FileService.getFile(hardcodePathTofile);

    res.setHeader("Content-Type", "application/pdf");
    stream.pipe(res);
}