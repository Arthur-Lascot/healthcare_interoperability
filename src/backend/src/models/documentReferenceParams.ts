import Identifier from "./Identifier"
import Reference from "../entities/Reference"
import codeableConcept from "./codeableConcept"
import coding from "./coding"
import { context } from "../entities/DocumentReference"

type documentReferenceParams = {
    resourceType: string;
    masterIdentifier?: Identifier;
    identifier?: Identifier[];
    status: string;
    docstatus?: string;
    type?: codeableConcept;
    category?: codeableConcept[];
    subject?: Reference;
    date?: Date;
    author?: Reference;
    authenticator?: Reference;
    custodian?: Reference;
    relatesTo?: {code: string, target: Reference}[];
    description?: string;
    securityLabel?: codeableConcept[];
    content: {attachment: undefined, format?: coding}[];
    context?: context;
}

export default documentReferenceParams