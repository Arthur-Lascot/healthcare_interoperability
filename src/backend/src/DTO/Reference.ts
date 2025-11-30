import Identifier from "../utils/structure/FHIR/Identifier";

interface Reference {
    readonly reference?:        string;
    readonly type?:             string;
    readonly identifier?:       Identifier;
    readonly display?:          string;
}

export default Reference;