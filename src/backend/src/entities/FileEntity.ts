import { FixedLengthArray } from "../models/FixedLengthArray";

export type FileEntity = {
    uuid?:                  string;
    Code:                   number;
    classCodeDisplayName:   string;
    LOINC:                  number;
    typeCodeDisplayName:    string;
    ReadableBy?:            FixedLengthArray<boolean, 19>;
};