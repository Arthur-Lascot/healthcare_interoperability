import { ValidationError } from "../errors/AppError";
import Address from "../utils/structure/FHIR/Address";
import codeableConcept from "../utils/structure/FHIR/codeableConcept";
import ContactPoint from "../utils/structure/FHIR/ContactPoint";
import HumanName from "../utils/structure/FHIR/HumanName";
import Identifier from "../utils/structure/FHIR/Identifier";
import Period from "../utils/structure/FHIR/Period";
import Reference from "./Reference";
import Resource from "./Resource";


const VALID_GENDERS = ["male", "female", "other", "unknown"] as const;

type practitionerGender = typeof VALID_GENDERS[number];

type qualification = {
    identifier?:                                Identifier[];
    code:                                       codeableConcept;
    period?:                                    Period;
    issuer?:                                    Reference;
}

class Practitioner extends Resource<"Practitioner"> {
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
        super('Practitioner');
        Object.assign(this, params);
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