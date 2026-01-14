import { ValidationError } from "../errors/AppError";
import attachment from "../utils/structure/FHIR/attachment";
import codeableConcept from "../utils/structure/FHIR/codeableConcept";
import Identifier from "../utils/structure/FHIR/Identifier";
import Period from "../utils/structure/FHIR/Period";
import Reference from "./Reference";
import Resource from "./Resource";

const VALID_STATUS = ['registered', 'partial', 'preliminary', 'final', 'amended', 'corrected', 'appended', 'cancelled', 'entered-in-error', 'unknown'] as const;

type diagnosticReportStatus = typeof VALID_STATUS[number]

type media = {
    comment?:                               string;
    link:                                   Reference;
}

class DiagnosticReport extends Resource<"DiagnosticReport"> {
    readonly identifier?:                   Identifier[];
    readonly basedOn?:                      Reference[];
    readonly status!:                       diagnosticReportStatus;
    readonly category?:                     codeableConcept[];
    readonly code!:                         codeableConcept;
    readonly subject?:                      Reference;
    readonly encounter?:                    Reference;
    readonly effectiveDateTime?:            Date;
    readonly effectivePeriod?:              Period;
    readonly issued?:                       Date;
    readonly performer?:                    Reference[];
    readonly resultsInterpreter?:           Reference[];
    readonly specimen?:                     Reference[];
    readonly result?:                       Reference[];
    readonly imagingStudy?:                 Reference[];
    readonly media?:                        media;
    readonly conclusion?:                   string;
    readonly conclusionCode?:               codeableConcept[];
    readonly presentedForm?:                attachment[];

    constructor(params: Partial<DiagnosticReport>) {
        super('DiagnosticReport');
        Object.assign(this, params);
        this.Validate();
    }

    private Validate(): void {
        if (!this.status) {
            throw new ValidationError('Error when initialising DiagnosticReport: Missing status value');
        }
        if (!VALID_STATUS.includes(this.status)) {
            throw new ValidationError(`Error when initialising DiagnosticReport: Invalid status value: "${this.status}". 
                Valid values: ${VALID_STATUS.join(", ")}`);
        }
        if (!this.code) {
            throw new ValidationError('Error when initialising DiagnosticReport: Missing code value');
        }
    }
}

export default DiagnosticReport;