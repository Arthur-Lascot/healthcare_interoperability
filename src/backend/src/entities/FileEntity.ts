import { UUID } from "crypto";

export type FileEntity = {
    uuid:                   UUID;
    code:                   number;
    classCodeDisplayName:   string;
    loinc:                  string;
    typeCodeDisplayName:    string;
    content:                string;
};