import codeableConcept from "../utils/structure/FHIR/codeableConcept";
import coding from "../utils/structure/FHIR/coding";
import Identifier from "../utils/structure/FHIR/Identifier";
import Reference from "../DTO/Reference";
import documentReferenceParams from "../utils/structure/FHIR/documentReferenceParams";
import { ValidationError } from "../errors/AppError";
import Period from "../utils/structure/FHIR/Period";
import Resource from "./Resource";
import attachment from "../utils/structure/FHIR/attachment";

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

class DocumentReference extends Resource<"DocumentReference"> {
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
    readonly content!:                       {attachment: attachment, format?: coding}[];
    readonly context?:                       context;

    constructor(params: documentReferenceParams) {
        super('DocumentReference')
        Object.assign(this, params);
        this.Validate();
  }

  private Validate() : void {
    if (!this.status) {
        throw new ValidationError('Error ininitialisation of DocumentReference: Missing status value');
    }
    if (!VALID_STATUS.includes(this.status)) {
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