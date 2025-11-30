import { ValidationError } from "../../../errors/AppError";
import Period from "./Period";

const VALID_USES = ["home", "work", "temp", "old", "billing"] as const;
const VALID_TYPES = ["postal", "physical", "both"] as const;

type addressUse = typeof VALID_USES[number];
type addressType = typeof VALID_TYPES[number];

class Address {
    use?:               addressUse;
    type?:              addressType;
    text?:              string;
    line?:              string[];
    city?:              string;
    district?:          string;
    state?:             string;
    postalCode?:        string;
    country?:           string;
    perdiod?:           Period;

    constructor(params: Partial<Address> = {}) {
        Object.assign(this, params);
        this.Validate();
    }

    private Validate(): void {
        if (this.use && !VALID_USES.includes(this.use)) {
            throw new ValidationError(`Error when initialising Adress: Invalid use value: "${this.use}". 
                                        Valid values: ${VALID_USES.join(", ")}`);
        }

        if (this.type && !VALID_TYPES.includes(this.type)) {
            throw new ValidationError(`Error when initialising Adress: Invalid type value: "${this.type}". 
                                        Valid values: ${VALID_TYPES.join(", ")}`);
        }
    }
}

export default Address;