import { ValidationError } from "../errors/AppError";
import Period from "./Period";

const VALID_USES = ["usual", "official", "temp", "nickname", "anonymous", "old", "maiden"] as const;

type HumanNameUse = typeof VALID_USES[number];

class HumanName {
    readonly use?:            HumanNameUse;
    readonly text?:           string;
    readonly family?:         string;
    readonly given?:          string[];
    readonly prefix?:         string[];
    readonly suffix?:         string[];
    readonly perdiod?:        Period;

    constructor(params: Partial<HumanName> = {}) {
        Object.assign(this, {...params});
        this.Validate();
    }

    private Validate(): void {
        if (this.use && !VALID_USES.includes(this.use)) {
            throw new ValidationError(`Error when initialising HumanName: Invalid system value: "${this.use}". 
                            Valid values: ${VALID_USES.join(", ")}`);
        }
    }
}

export default HumanName; 