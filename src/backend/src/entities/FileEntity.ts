import { UUID } from "crypto";

export type FileEntity = {
    uuid:                   UUID;
    code:                   number;
    classCodeDisplayName:   string;
    LOINC:                  string;
    typeCodeDisplayName:    string;
    content:                string;
};