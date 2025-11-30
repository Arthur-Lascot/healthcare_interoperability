import { ValidationError } from "../../../errors/AppError";
import codeableConcept from "./codeableConcept";
import Period from "./Period";

const VALID_USES = ["usual", "official", "temp", "secondary", "old"] as const;

type identifierUse = typeof VALID_USES[number];

class Identifier {
    use?:                   identifierUse;
    type?:                  codeableConcept;
    system?:                string;
    value?:                 string;
    period?:                Period;
    assigner?:              undefined; // Not needed for the project and too big to implement as a placeholder

    constructor(params: Partial<Identifier> = {}) {
        Object.assign(this, params);
        this.Validate();
    }

    private Validate(): void {
        if (this.use && !VALID_USES.includes(this.use)) {
            throw new ValidationError(`Error when initialising Identifier: Invalid use value: "${this.use}". 
                                        Valid values: ${VALID_USES.join(", ")}`);
        }
    }
}

export default Identifier;