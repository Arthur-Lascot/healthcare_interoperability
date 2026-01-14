import codeableConcept from "../utils/structure/FHIR/codeableConcept";
import Identifier from "../utils/structure/FHIR/Identifier";
import Period from "../utils/structure/FHIR/Period";
import Reference from "./Reference";
import Resource from "./Resource";
import { ValidationError } from "../errors/AppError";


const VALID_STATUS = ['proposed', 'pending' ,'booked', 'arrived', 'fulfilled', 'cancelled', 'noshow', 'entered-in-error', 'checked-in', 'waitlist'] as const;
const VALID_REQUIRED = ['required', 'optional', 'information-only'] as const;
const VALID_PARTICIPANT_STATUS = ['accepted', 'declined', 'tentative', 'needs-action'] as const;

type appointmentStatus = typeof VALID_STATUS[number];
type participantRequired = typeof VALID_REQUIRED[number];
type participantStatus = typeof VALID_PARTICIPANT_STATUS[number];


type participant = {
    type?:                          codeableConcept[];
    actor?:                         Reference;
    required?:                      participantRequired;
    status:                         participantStatus;
    period?:                        Period;
}

class Appointment extends Resource<"Appointment"> {
    identifier?:                    Identifier;
    status!:                        appointmentStatus;
    cancelationReason?:             codeableConcept;
    serviceCategory?:               codeableConcept[];
    serviceType?:                   codeableConcept[];
    specialty?:                     codeableConcept[];
    appointmentType?:               codeableConcept;
    reasonCode?:                    codeableConcept[];
    reasonReference?:               undefined;
    priority?:                      number;
    description?:                   string;
    supportingInformation?:         undefined;
    start?:                         Date;
    end?:                           Date;
    minutesDuration?:               number;
    slot?:                          undefined;
    created?:                       Date;
    comment?:                       string;
    patientInstruction?:            string;
    basedOn?:                       Reference;
    participant!:                   participant[];
    requestedPeriod?:               Period[];

    constructor(params: Partial<Appointment>) {
        super('Appointment');
        Object.assign(this, params);
        this.Validate();
    }

    private Validate(): void {
        if (!this.status) {
            throw new ValidationError('Error when initialising Appointment: Missing status value');
        }
        if (!VALID_STATUS.includes(this.status)) {
            throw new ValidationError(`Error when initialising Appointment: Invalid status value
                                        Valid values: ${VALID_STATUS.join(", ")}`);
        }
        if (this.participant) {
            for (const p of this.participant) {
                if (!VALID_PARTICIPANT_STATUS.includes(p.status)) {
                    throw new ValidationError(`Error when initialising Appointment: Invalid status value in participant: "${p.status}". 
                                        Valid values: ${VALID_PARTICIPANT_STATUS.join(", ")}`);       
                }
                if (p.required && !VALID_REQUIRED.includes(p.required)) {
                    throw new ValidationError(`Error when initialising Appointment: Invalid required value in participant: "${p.required}". 
                                        Valid values: ${VALID_REQUIRED.join(", ")}`);       
                }   
            }
        }
        if (this.minutesDuration && this.minutesDuration < 0) {
            throw new ValidationError(`Error when initialising Appointment: Invalid minutesDuration value: "${this.minutesDuration}".`)
        }
        if (this.priority && this.priority < 0) {
            throw new ValidationError(`Error when initialising Appointment: Invalid priority value: "${this.priority}".`)
        }
    }
}

export default Appointment;