import Reference from "../entities/Reference"
import CodeableConcept from "./CodeableConcept";
import Period from "./Period";

type Context = {
    encounter?:              Reference[];
    event?:                  CodeableConcept[];
    period?:                 Period;
    facilityType?:           CodeableConcept;
    practiceSetting?:        CodeableConcept;
    sourcePatientInfo?:      Reference;
    related?:                Reference[];
}

export default Context;