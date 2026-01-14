import Code from "./Code";

type identifiant = {
    valeur:                         string;
    qualification?:                 string;
    identifiantSysteme?:            string;
    nomSysteme?:                    string;
    versionSysteme?:                string;
    URISysteme?:                    string;
    identifiantAgence?:             string;
    nomAgence?:                     string;
    typeIdentifiant?:               Code;
}

export default identifiant;