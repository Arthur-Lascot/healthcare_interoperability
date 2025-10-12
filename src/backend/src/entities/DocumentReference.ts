import CodeableConcept from "../models/CodeableConcept";
import Coding from "../models/Coding";
import Context from "../models/Context";
import Identifier from "../models/Identifier";
import Reference from "./Reference";
import DocumentReferenceParams from "../models/DocumentReferenceParams";
import { ValidationError } from "../errors/AppError";

class DocumentReference {
    readonly ressourceType!:                 String;
    readonly masterIdentifier?:              Identifier;
    readonly identifier?:                    Identifier[];
    readonly status!:                        String;
    readonly docstatus?:                     String;
    readonly type?:                          CodeableConcept;
    readonly category?:                      CodeableConcept[];
    readonly subject?:                       Reference;
    readonly date?:                          Date;
    readonly author?:                        Reference;
    readonly authenticator?:                 Reference;
    readonly custodian?:                     Reference;
    readonly relatesTo?:                     {code: String, target: Reference}[];
    readonly description?:                   String;
    readonly securityLabel?:                 CodeableConcept[];
    readonly content!:                       {attachment: undefined, format?: Coding}[];
    readonly context?:                       Context;

    constructor(params: DocumentReferenceParams) {
        Object.assign(this, params);

        if (this.status !== "current" && this.status !== "superseded" && this.status !== "entered-in-error") {
            throw new ValidationError(`Status field is set with an incorrect value "${this.status}" 
                when trying to initialise DocumentReference`);
        }

        if (this.docstatus) {
            if (this.docstatus !== "preliminary" && this.docstatus !== "final" && this.docstatus !== "amended"
                && this.docstatus !== "entered-in-error") {
                throw new ValidationError(`DocStatus field is set with an incorrect value "${this.docstatus}" 
                    when trying to initialise DocumentReference`);
            }
        }

        if (this.relatesTo) {
            for (const code in this.relatesTo)
                if (code !== "replaces" && code !== "transforms" && code !== "signs" && code !== "appends") {
                    throw new ValidationError(`Code field in relatesTo field is set with an incorrect value "${code}" 
                        when trying to initialise DocumentReference`);
                }
        }
  }
}

export default DocumentReference;