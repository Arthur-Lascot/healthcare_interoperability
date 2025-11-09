import coding from "./coding"

type codeableConcept = {
    coding?:                     coding[];
    text?:                       string;
}

export default codeableConcept;