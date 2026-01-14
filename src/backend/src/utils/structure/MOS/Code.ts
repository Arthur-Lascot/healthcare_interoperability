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

    constructor(valeur: string, libelle?: string, langue?: string, identifiantNomenclature?: string, versionNomenclature?: string) {
        this.valeur = valeur;
        this.libelle = libelle;
        this.langue = langue;
        this.identifiantNomenclature = identifiantNomenclature;
        this.nomNomenclature = 'LOINC';
        this.versionNomenclature = versionNomenclature;
        this.URINomenclature = 'https://loinc.org/';
    }
}

export default Code;