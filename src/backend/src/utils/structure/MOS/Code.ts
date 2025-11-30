import coding from "../FHIR/coding";

class Code {
    readonly valeur:                     string;
    readonly libelle?:                   string;
    readonly langue?:                    string;
    readonly identifiantNomenclature?:   string;
    readonly nomNomenclature?:           string;
    readonly versionNomenclature?:       string;
    readonly URINomenclature?:           string;
    readonly identifiantAgence?:         string;
    readonly nomAgence?:                 string;

    constructor(coding_FHIR: coding, langue?: string) {
        this.valeur = coding_FHIR.code || 'unknown';
        this.libelle = coding_FHIR.display;
        this.langue = langue;
        this.identifiantNomenclature = coding_FHIR.system;
        this.nomNomenclature = 'LOINC';
        this.versionNomenclature = coding_FHIR.version;
        this.URINomenclature = 'https://loinc.org/';
    }
}

export default Code;