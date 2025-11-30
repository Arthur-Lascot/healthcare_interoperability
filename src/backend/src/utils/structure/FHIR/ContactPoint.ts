import { ValidationError } from "../../../errors/AppError";
import Period from "./Period";

const VALID_SYSTEMS = ["phone", "fax", "email", "pager", "url", "sms", "other"] as const;
const VALID_USES = ["home", "work", "temp", "mobile", "old"] as const;

type contactPointSystem = typeof VALID_SYSTEMS[number];
type contactPointUse = typeof VALID_USES[number];

class ContactPoint {
    readonly system?:        contactPointSystem;
    readonly value?:         string;
    readonly use?:           contactPointUse;
    readonly rank?:          number;
    readonly period?:        Period;

    constructor(params: Partial<ContactPoint> = {}) {
        Object.assign(this, params);
        this.validate();
    }

    private validate(): void {
        if (this.value !== undefined && this.system === undefined) {
            throw new ValidationError("Error when initialising ContactPoint: system field must be set when value field is set");
        }

        if (this.system && !VALID_SYSTEMS.includes(this.system)) {
            throw new ValidationError(`Error when initialising ContactPoint: Invalid system value: "${this.system}". 
                Valid values: ${VALID_SYSTEMS.join(", ")}`);
        }

        if (this.use && !VALID_USES.includes(this.use)) {
            throw new ValidationError(`Error when initialising ContactPoint: Invalid use value: "${this.use}". 
                Valid values: ${VALID_USES.join(", ")}`);
        }

        if (this.rank !== undefined && (this.rank < 1 || !Number.isInteger(this.rank))) {
            throw new ValidationError("Error when initialising ContactPoint: rank must be a positive integer");
        }
    }
}

export default ContactPoint