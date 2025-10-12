import Identifier from "./Identifier"
import Reference from "../entities/Reference"
import CodeableConcept from "./CodeableConcept"
import Coding from "./Coding"
import Context from "./Context"

type DocumentReferenceParams = {
    ressourceType: String;
    masterIdentifier?: Identifier;
    identifier?: Identifier[];
    status: String;
    docstatus?: String;
    type?: CodeableConcept;
    category?: CodeableConcept[];
    subject?: Reference;
    date?: Date;
    author?: Reference;
    authenticator?: Reference;
    custodian?: Reference;
    relatesTo?: {code: String, target: Reference}[];
    description?: String;
    securityLabel?: CodeableConcept[];
    content: {attachment: undefined, format?: Coding}[];
    context?: Context;
}

export default DocumentReferenceParams