import CodeableConcept from "../models/CodeableConcept";
import Coding from "../models/Coding";
import Context from "../models/Context";
import Identifier from "../models/Identifier";
import Reference from "./Reference";

class DocumentReference {
    readonly ressourceType:                  String;
    readonly masterIdentifier?:              Identifier;
    readonly identifier?:                    Identifier[];
    readonly status:                         String;
    readonly docstatus:                      String;
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
    readonly content:                        {attachment: undefined, format?: Coding}[];
    readonly context?:                       Context;

    constructor(status: String, docstatus: String, content: {attachment: undefined, format?: Coding}[]) {
        this.ressourceType = "DocumentReference";
        this.status = status;
        this.docstatus = docstatus;
        this.content = content;
    }
}

export default DocumentReference;