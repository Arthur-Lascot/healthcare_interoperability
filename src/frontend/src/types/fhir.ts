

export interface Coding {
    system?: string;
    code?: string;
    display?: string;
}

export interface CodeableConcept {
    coding?: Coding[];
    text?: string;
}

export interface DocumentReference {
    resourceType: "DocumentReference";
    id?: string;
    type?: CodeableConcept;
    description?: string;
    content?: {attachment: {url: string}};
}

export interface BundleEntry {
    resource?: DocumentReference;
}

const VALID_INTENT = ['proposal', 'plan', 'directive', 'order', 'original-order', 'reflex-order', 'filler-order', 'instance-order', 'option'] as const;
const VALID_STATUS = ['proposed', 'pending' ,'booked', 'arrived', 'fulfilled', 'cancelled', 'noshow', 'entered-in-error', 'checked-in', 'waitlist'] as const;


type appointmentStatus = typeof VALID_STATUS[number];

type participant = {
    type?:                          CodeableConcept[];
}

export interface Appointment {
    participant: participant[];
    status: appointmentStatus;
}

const VALID_USES = ["usual", "official", "temp", "secondary", "old"] as const;

type identifierUse = typeof VALID_USES[number];

class Identifier {
    use?:                   identifierUse;
    system?:                string;
    value?:                 string;
    assigner?:              undefined; // Not needed for the project and too big to implement as a placeholder
}

interface Reference {
    readonly reference?:        string;
    readonly type?:             string;
    readonly identifier?:       Identifier;
    readonly display?:          string;
}
type serviceRequestStatus = typeof VALID_STATUS[number];
type serviceRequestIntent = typeof VALID_INTENT[number];

class ServiceRequest {
    resourceType?: "ServiceRequest";
    readonly status!:                           serviceRequestStatus;
    readonly intent!:                           serviceRequestIntent;
    readonly subjetc!:                          Reference;
}

export interface Bundle {
    resourceType: "Bundle";
    type: string;
    total?: number;
    entry?: BundleEntry[];
}