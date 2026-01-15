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
    fullUrl?: string;
    resource?: DocumentReference;
}

export interface Bundle {
    resourceType: "Bundle";
    type: string;
    total?: number;
    entry?: BundleEntry[];
}