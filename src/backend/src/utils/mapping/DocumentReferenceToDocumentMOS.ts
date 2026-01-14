import DocumentReference from "../../DTO/DocumentReference";
import DocumentMOS from "../../models/DocumentMOS";
import coding from "../structure/FHIR/coding";
import Code from "../structure/MOS/Code";

const DocumentReferenceToDocumentMOS = (document: DocumentReference): DocumentMOS => {
    const format: coding = document.type!.coding![0] || {};
    const code: Code = new Code(format);

    const metadata = {
        author:         undefined,
        creationDate:   document.date,
        status:         document.status,
        location:       document.content[0].attachment.url,
        accessLogs:     undefined,
        rawFHIR:        document
    };

    const documentMOS: DocumentMOS = new DocumentMOS({typeDocument: code, meatdonnee: metadata});
    return documentMOS;
}

export default DocumentReferenceToDocumentMOS;