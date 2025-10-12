import Reference from "../entities/Reference"
import codeableConcept from "./codeableConcept";
import Period from "./Period";

type context = {
    encounter?:              Reference[];
    event?:                  codeableConcept[];
    period?:                 Period;
    facilityType?:           codeableConcept;
    practiceSetting?:        codeableConcept;
    sourcePatientInfo?:      Reference;
    related?:                Reference[];
}

export default context;