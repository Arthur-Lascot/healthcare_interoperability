import { ValidationError } from "../errors/AppError";
import Identifier from "../utils/structure/FHIR/Identifier";
import Resource from "./Resource";


const VALID_TYPE = ['document', 'message' ,'transaction', 'transaction-response', 'batch', 'batch-response', 'history', 'searchset', 'collection'] as const;
const VALID_MODE = ['match', 'include', 'outcome']

type bundleType = typeof VALID_TYPE[number];
type searchMode = typeof VALID_MODE[number];

type entry = {
    link?:                           undefined;
    fullUrl?:                        string;
    resource?:                       Resource;
    search?:                         { mode: searchMode, score: number};
    request?:                        undefined;
    response?:                       undefined;
}

class Bundle extends Resource<"Bundle"> {
    identifier?:                    Identifier;
    type!:                          bundleType;
    timestamp?:                     Date;
    total?:                         number;
    link?:                          undefined;
    entry?:                         entry[];
    signature?:                     undefined;

    constructor(params: Partial<Bundle>) {
        super('Bundle');
        Object.assign(this, params);
        this.Validate();
    }

    private Validate(): void {
        if (!this.type) {
            throw new ValidationError('Error when initialising Bundle: Missing type value');
        }
        if (!VALID_TYPE.includes(this.type)) {
            throw new ValidationError(`Error when initialising Bundle: Invalid type value: "${this.type}". 
                                        Valid values: ${VALID_TYPE.join(", ")}`);
        }
        if (this.entry) {
            for (const e of this.entry) {
                if (e.search && !VALID_MODE.includes(e.search.mode)) {
                    throw new ValidationError(`Error when initialising Bundle: Invalid mode value in entry: "${e.search.mode}". 
                                        Valid values: ${VALID_MODE.join(", ")}`);
                }
            }
        }
    }
}

export default Bundle;