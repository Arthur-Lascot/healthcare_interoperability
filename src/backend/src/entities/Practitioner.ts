import { ValidationError } from "../errors/AppError";
import Address from "../models/Address";
import codeableConcept from "../models/codeableConcept";
import ContactPoint from "../models/ContactPoint";
import HumanName from "../models/HumanName";
import Identifier from "../models/Identifier";
import Period from "../models/Period";
import Reference from "./Reference";

const VALID_GENDERS = ["male", "female", "other", "unknown"] as const;

type practitionerGender = typeof VALID_GENDERS[number];

type qualification = {
    identifier?:                                Identifier[];
    code:                                       codeableConcept;
    period?:                                    Period;
    issuer?:                                    Reference;
}

class Practitioner {
    readonly resourceType!:                     string;
    readonly identifier?:                       Identifier[];
    readonly active?:                           boolean;
    readonly name?:                             HumanName[];
    readonly telecom?:                          ContactPoint[];
    readonly address?:                          Address[];
    readonly gender?:                           practitionerGender;
    readonly birthDate?:                        Date;
    readonly photo?:                            undefined;
    readonly qualification?:                    qualification[];
    readonly communication?:                    codeableConcept[];

    constructor(params: Partial<Practitioner>) {
        Object.assign(this, params);
        this.resourceType = "Practitioner";
        this.Validate();
    }

    private Validate(): void {
        if (this.gender && !VALID_GENDERS.includes(this.gender)) {
                    throw new ValidationError(`Error when initialising Practitioner: Invalid gender value: "${this.gender}". 
                                                Valid values: ${VALID_GENDERS.join(", ")}`);
        }
    }
}

export default Practitioner;