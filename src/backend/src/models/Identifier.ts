import CodeableConcept from "./CodeableConcept";
import Period from "./Period";

type Identifier = {
    use:                    String;
    type?:                  CodeableConcept;
    system?:                String;
    value?:                 String;
    period?:                Period;
    assigner?:              undefined; // Not needed for the project and too big to implement as a placeholder
}

export default Identifier;