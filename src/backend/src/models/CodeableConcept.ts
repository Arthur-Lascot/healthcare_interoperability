import Coding from "./Coding"

type CodeableConcept = {
    coding?:                     Coding[];
    text?:                       String;
}

export default CodeableConcept;