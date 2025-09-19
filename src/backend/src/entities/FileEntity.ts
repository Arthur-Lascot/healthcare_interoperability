import { UUID } from "crypto";
import { FixedLengthArray } from "../models/FixedLengthArray";

export type FileEntity = {
    uuid:                   UUID;
    Code:                   number;
    classCodeDisplayName:   string;
    LOINC:                  number;
    typeCodeDisplayName:    string;
    ReadableBy:             FixedLengthArray<boolean, 19>;
};