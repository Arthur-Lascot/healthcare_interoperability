import coding from "../utils/structure/FHIR/coding";
import Code from "../utils/structure/MOS/Code";

type Metadonnee = {
    author?:                                    string;
    creationDate?:                              Date;
    format?:                                    coding;
    status?:                                    string;
    location:                                   string;
    accessLogs?:                                undefined;
    rawFHIR?:                                   any;
}

class DocumentMOS {
    typeDocument?:                     Code;
    meatdonnee?:                       Metadonnee;

    constructor(params: Partial<DocumentMOS>) {
        Object.assign(this, params);
    }
}

export default DocumentMOS