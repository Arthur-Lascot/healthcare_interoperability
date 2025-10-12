import { ValidationError } from "../errors/AppError";

class Period {
    start?:      Date;
    end?:        Date;

    constructor(start?: Date, end?: Date) {
        this.start = start;
        this.end = end;
        this.Validate();
    }

    private Validate(): void {
        if (this.start && this.end) {
            if (this.start >= this.end)
                throw new ValidationError(`Error when initialising Period: start >= end`);
        }
    }
}

export default Period;