import { ValidationError } from "../errors/AppError";
import Resource from "./Resource";
import codeableConcept from "../utils/structure/FHIR/codeableConcept";
import Identifier from "../utils/structure/FHIR/Identifier";
import Period from "../utils/structure/FHIR/codeableConcept";
import Reference from "./Reference";

const VALID_STATUS = ['registered', 'preliminary', 'final', 'amended', 'corrected', 'cancelled', 'entered-in-error', 'unknown'] as const;

type observationStatus = typeof VALID_STATUS[number];

type referenceRange = {
    low?:                                   undefined;
    high?:                                  undefined;
    type?:                                  codeableConcept;
    appliesTo?:                             codeableConcept[];
    age?:                                   undefined;
    text?:                                  string;
}

type observationComponent = {
    code:                                   codeableConcept;
    valueQuantity?:                         undefined;
    valueCodeableConcept?:                  codeableConcept;
    valueString?:                           string;
    valueBoolean?:                          boolean;
    valueInteger?:                          number;
    valueRange?:                            undefined;
    valueRatio?:                            undefined;
    valueSampledData?:                      undefined;
    valueTime?:                             string;
    valueDateTime?:                         Date;
    valuePeriod?:                           Period;
    dataAbsentReason?:                      codeableConcept;
    interpretation?:                        codeableConcept[];
    referenceRange?:                        referenceRange[];
}

class Observation extends Resource<"Observation"> {
    readonly identifier?:                   Identifier[];
    readonly basedOn?:                      Reference[];
    readonly partOf?:                       Reference[];
    readonly status!:                       observationStatus;
    readonly category?:                     codeableConcept[];
    readonly code!:                         codeableConcept;
    readonly subject?:                      Reference;
    readonly focus?:                        Reference[];
    readonly encounter?:                    Reference;
    readonly effectiveDateTime?:            Date;
    readonly effectivePeriod?:              Period;
    readonly effectiveTiming?:              undefined;
    readonly effectiveInstant?:             Date;
    readonly issued?:                       Date;
    readonly performer?:                    Reference[];
    readonly valueQuantity?:                undefined;
    readonly valueCodeableConcept?:         codeableConcept;
    readonly valueString?:                  string;
    readonly valueBoolean?:                 boolean;
    readonly valueInteger?:                 number;
    readonly valueRange?:                   undefined;
    readonly valueRatio?:                   undefined;
    readonly valueSampledData?:             undefined;
    readonly valueTime?:                    string;
    readonly valueDateTime?:                Date;
    readonly valuePeriod?:                  Period;
    readonly dataAbsentReason?:             codeableConcept;
    readonly interpretation?:               codeableConcept[];
    readonly note?:                         undefined[];
    readonly bodySite?:                     codeableConcept;
    readonly method?:                       codeableConcept;
    readonly specimen?:                     Reference;
    readonly device?:                       Reference;
    readonly referenceRange?:               referenceRange[];
    readonly hasMember?:                    Reference[];
    readonly derivedFrom?:                  Reference[];
    readonly component?:                    observationComponent[];

    constructor(params: Partial<Observation>) {
        super('Observation');
        Object.assign(this, params);
        this.Validate();
    }

    private Validate(): void {
        if (!this.status) {
            throw new ValidationError('Error when initialising Observation: Missing status value');
        }
        if (!VALID_STATUS.includes(this.status)) {
            throw new ValidationError(`Error when initialising Observation: Invalid status value: "${this.status}". 
                Valid values: ${VALID_STATUS.join(", ")}`);
        }
        if (!this.code) {
            throw new ValidationError('Error when initialising Observation: Missing code value');
        }
    }

}