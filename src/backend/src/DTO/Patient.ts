import ContactPoint from "../utils/structure/FHIR/ContactPoint";
import HumanName from "../utils/structure/FHIR/HumanName";
import Identifier from "../utils/structure/FHIR/Identifier";
import Address from "../utils/structure/FHIR/Address";
import codeableConcept from "../utils/structure/FHIR/codeableConcept";
import Reference from "./Reference";
import Period from "../utils/structure/FHIR/Period";
import { ValidationError } from "../errors/AppError";
import Resource from "./Resource";

const VALID_GENDERS = ["male", "female", "other", "unknown"] as const;
const VALID_TYPES = ["replaced-by", "replaces", "refer", "seealso"] as const;

type patientGender = typeof VALID_GENDERS[number];
type linkType = typeof VALID_TYPES[number];

type contact = {
    relationship?:              codeableConcept[];
    name?:                      HumanName;
    telecom?:                   ContactPoint[];
    address?:                   Address;
    gender?:                    patientGender;
    organization?:              Reference;
    period?:                    Period;
}

type communication = {
    language:                   codeableConcept;
    preferred?:                 boolean;
}

type link = {
    other:                     Reference;
    type:                      linkType;
}

class Patient extends Resource<"Patient"> {
    identifier?:                Identifier;
    active?:                    boolean;
    name?:                      HumanName[];
    telecom?:                   ContactPoint[];
    gender?:                    patientGender;
    birthDate?:                 Date;
    deceasedBoolean?:           boolean;
    deceasedDateTime?:          Date;
    address?:                   Address;
    maritalStatus?:             codeableConcept;
    multipleBirthBoolean?:      boolean;
    multipleBirthInteger?:      number;
    photo?:                     undefined;
    contact?:                   contact[];
    communication?:             communication[];
    generalPractitioner?:       Reference[];
    managingOrganization?:      Reference;
    link?:                      link[];

    constructor(params: Partial<Patient> = {}) {
        super('Patient');
        Object.assign(this, params);
        this.Validate();
    }

    private Validate(): void {
        if (this.gender && !VALID_GENDERS.includes(this.gender)) {
            throw new ValidationError(`Error when initialising Patient: Invalid gender value: "${this.gender}". 
                                        Valid values: ${VALID_GENDERS.join(", ")}`);
        }

        if (this.contact) {
            for (const c of this.contact) {
                if (c.gender && !VALID_GENDERS.includes(c.gender)) {
                    throw new ValidationError(`Error when initialising Patient: Invalid gender value in contact: "${c.gender}". 
                                        Valid values: ${VALID_GENDERS.join(", ")}`);
                }
            }
        }

        if (this.link) {
            for (const l of this.link) {
                if (!VALID_TYPES.includes(l.type)) {
                    throw new ValidationError(`Error when initialising Patient: Invalid type value in link: "${l.type}". 
                                        Valid values: ${VALID_TYPES.join(", ")}`);
                }
            }
        }
    }
}

export default Patient;