import Identifier from "../models/Identifier";

interface Reference {
    readonly reference?:      String;
    readonly type?:           String;
    readonly identifier?:    Identifier;
    readonly display?:       String;
}

export default Reference;