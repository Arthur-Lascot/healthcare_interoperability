import Identifier from "./Identifier"
import Reference from "../../../DTO/Reference"
import codeableConcept from "./codeableConcept"
import coding from "./coding"
import { context } from "../../../DTO/DocumentReference"

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