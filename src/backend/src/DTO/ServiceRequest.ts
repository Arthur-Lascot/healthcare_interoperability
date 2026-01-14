import { ValidationError } from "../errors/AppError";
import codeableConcept from "../utils/structure/FHIR/codeableConcept";
import Identifier from "../utils/structure/FHIR/Identifier"
import Period from "../utils/structure/FHIR/Period";
import Reference from "./Reference" 
import Resource from "./Resource";

const VALID_STATUS = ['draf', 'active', 'onhold', 'revoked', 'completed', 'entered-in-error', 'unknown'] as const;
const VALID_INTENT = ['proposal', 'plan', 'directive', 'order', 'original-order', 'reflex-order', 'filler-order', 'instance-order', 'option'] as const;
const VALID_PRIORITY = ['routine', 'urgent', 'asap', 'stat'] as const;


type serviceRequestStatus = typeof VALID_STATUS[number];
type serviceRequestIntent = typeof VALID_INTENT[number];
type serviceRequestPriority = typeof VALID_PRIORITY[number];

class ServiceRequest extends Resource<"ServiceRequest"> {
    readonly Identifier?:                       Identifier[];
    readonly instantiatesCanonical?:            undefined[];
    readonly instantiatesUri?:                  string[];
    readonly basedOn?:                          Reference[];
    readonly replaces?:                         Reference[];
    readonly requisition?:                      Identifier;
    readonly status!:                           serviceRequestStatus;
    readonly intent!:                           serviceRequestIntent;
    readonly category?:                         codeableConcept[];
    readonly priority?:                         serviceRequestPriority;
    readonly doNotPerform?:                     boolean;
    readonly code?:                             codeableConcept;
    readonly orderDetail?:                      codeableConcept[];
    readonly quantityQuantity?:                 undefined;
    readonly quantityRatio?:                    undefined;
    readonly quantityRange?:                    undefined;
    readonly subjetc!:                          Reference;
    readonly encounter?:                        Reference;
    readonly occurenceDateTime?:                Date;
    readonly occurencePeriode?:                 Period;
    readonly occurenceTiming?:                  undefined;
    readonly asNeededBoolean?:                  boolean;
    readonly asNeededCodeableConcept?:          codeableConcept;
    readonly authoredOn?:                       Date;
    readonly requester?:                        Reference;
    readonly performerType?:                    codeableConcept;
    readonly performer?:                        Reference[];
    readonly locationCode?:                     codeableConcept[];
    readonly locationReference?:                Reference[];
    readonly reasonCode?:                       codeableConcept[];
    readonly reasonReference?:                  Reference[];
    readonly insurance?:                        Reference[];
    readonly supportingInfo?:                   Reference[];
    readonly specimen?:                         Reference[];
    readonly bodysite?:                         codeableConcept[];
    readonly note?:                             undefined;
    readonly patientInstruction?:               string;
    readonly relevantHistory?:                  Reference[];

    constructor(params: Partial<ServiceRequest>) {
        super('ServiceRequest');
        Object.assign(this, params);
        this.Validate();
    }

    private Validate(): void {
        if (!this.status) {
            throw new ValidationError('Error when initialising ServiceRequest: Missing status value');
        }
        if (!VALID_STATUS.includes(this.status)) {
            throw new ValidationError(`Error when initialising ServiceRequest: Invalid status value: "${this.status}". 
                Valid values: ${VALID_STATUS.join(", ")}`);
        }
        if (!this.intent) {
            throw new ValidationError('Error when initialising ServiceRequest: Missing intent value');
        }
        if (!VALID_INTENT.includes(this.intent)) {
            throw new ValidationError(`Error when initialising ServiceRequest: Invalid intent value: "${this.intent}". 
                Valid values: ${VALID_INTENT.join(", ")}`);
        }
        if (this.priority && !VALID_PRIORITY.includes(this.priority)) {
            throw new ValidationError(`Error when initialising ServiceRequest: Invalid priority value: "${this.priority}". 
                Valid values: ${VALID_PRIORITY.join(", ")}`);
        }
    }
}

export default ServiceRequest;