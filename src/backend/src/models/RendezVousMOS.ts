import Code from "../utils/structure/MOS/Code";
import identifiant from "../utils/structure/MOS/identifiant";

class RendezVous {
    idRdv?:                         identifiant;
    typeRdv?:                       Code;
    datePriseRdv?:                  Date;
    dateDebutRdv?:                  Date;
    dateFinRdv?:                    Date;
    dateAnnulationRdv?:             Date;
    pieceJointe?:                   undefined;
    priorite?:                      Code;
    titreRdv?:                      string;
    statusRdv?:                     Code;
    descriptionRdv?:                string;
    motifRdv?:                      string;
    commentaire?:                   string;
    metadonnee?:                    undefined;

    constructor(params: Partial<RendezVous>) {
        Object.assign(this, params);
    }
}

export default RendezVous;