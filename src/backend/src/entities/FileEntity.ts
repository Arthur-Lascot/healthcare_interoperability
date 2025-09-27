import { UUID } from "crypto";

export type FileEntity = {
    uuid:                   UUID;
    code:                   string;
    classCodeDisplayName:   string;
    LOINC:                  string;
    typeCodeDisplayName:    string;
    content:                string;
};