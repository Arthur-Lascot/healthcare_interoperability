import codeableConcept from "../models/codeableConcept";
import coding from "../models/coding";
import Identifier from "../models/Identifier";
import Reference from "./Reference";
import documentReferenceParams from "../models/documentReferenceParams";
import { ValidationError } from "../errors/AppError";
import Period from "../models/Period";

const VALID_STATUS = ["current", "superseded", "entered-in-error"] as const;
const VALID_DOCSTATUS = ["preliminary", "final", "amended", "entered-in-error"] as const;

type documentReferenceStatus = typeof VALID_STATUS[number];
type documentReferenceDocStatus = typeof VALID_DOCSTATUS[number];

export type context = {
    encounter?:              Reference[];
    event?:                  codeableConcept[];
    period?:                 Period;
    facilityType?:           codeableConcept;
    practiceSetting?:        codeableConcept;
    sourcePatientInfo?:      Reference;
    related?:                Reference[];
}

class DocumentReference {
    readonly resourceType!:                  string;
    readonly masterIdentifier?:              Identifier;
    readonly identifier?:                    Identifier[];
    readonly status!:                        documentReferenceStatus;
    readonly docStatus?:                     documentReferenceDocStatus;
    readonly type?:                          codeableConcept;
    readonly category?:                      codeableConcept[];
    readonly subject?:                       Reference;
    readonly date?:                          Date;
    readonly author?:                        Reference;
    readonly authenticator?:                 Reference;
    readonly custodian?:                     Reference;
    readonly relatesTo?:                     {code: string, target: Reference}[];
    readonly description?:                   string;
    readonly securityLabel?:                 codeableConcept[];
    readonly content!:                       {attachment: undefined, format?: coding}[];
    readonly context?:                       context;

    constructor(params: documentReferenceParams) {
        Object.assign(this, params);
        this.resourceType = "DocumentReference";
        this.Validate();
  }

  private Validate() : void {
    if (this.status && !VALID_STATUS.includes(this.status)) {
        throw new ValidationError(`Error ininitialisation of DocumentReference: Invalid status value: "${this.status}". 
                Valid values: ${VALID_STATUS.join(", ")}`);
    }

    if (this.docStatus && !VALID_DOCSTATUS.includes(this.docStatus)) {
        throw new ValidationError(`Error ininitialisation of DocumentReference: Invalid docStatus value: "${this.docStatus}". 
                Valid values: ${VALID_DOCSTATUS.join(", ")}`);
    }
  }
}

export default DocumentReference;