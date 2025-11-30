DROP TABLE IF EXISTS documents CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE mos_code (
    id                          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    valeur                      text NOT NULL,
    libelle                     text,
    langue                      text,
    identifiant_nomenclature    text,
    nom_nomenclature            text DEFAULT 'LOINC',
    version_nomenclature        text,
    uri_nomenclature            text DEFAULT 'https://loinc.org/',
    identifiant_agence          text,
    nom_agence                  text,
    created_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE mos_document_metadonnee (
    id                      uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    author                  text,
    creation_date           timestamptz,
    status                  text,
    location                text,
    access_logs             jsonb,
    raw_fhir                jsonb,
    created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE document_mos (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    type_document_id uuid REFERENCES mos_code(id) ON DELETE SET NULL,
    metadonnee_id    uuid REFERENCES mos_document_metadonnee(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON mos_document_metadonnee (creation_date);
CREATE INDEX ON mos_code (valeur);




------------------------------------INSERTION D'EXEMPLES--------------------------------------------

-- 1) Insérer un code MOS
INSERT INTO mos_code (valeur, libelle, langue, identifiant_nomenclature, version_nomenclature)
VALUES ('34133-9','Summarization of episode note','fr','LOINC','2.69')
RETURNING id;

-- 2) Insérer une métadonnée avec raw_fhir FHIR DocumentReference
INSERT INTO mos_document_metadonnee (author, creation_date, status, location, access_logs, raw_fhir)
VALUES (
  'Dr. Dupont',
  '2025-11-09T10:30:00+01:00',
  'current',
  'Hôpital Saint-Jean - Dossier 1234',
  jsonb_build_array(jsonb_build_object('user','nurse1','action','read','ts','2025-11-09T11:00:00+01:00')),
  $json$
{
  "resourceType":"DocumentReference",
  "id":"doc-1234",
  "meta":{"versionId":"1","lastUpdated":"2025-11-09T10:30:00+01:00"},
  "status":"current",
  "docStatus":"final",
  "type":{"coding":[{"system":"http://loinc.org","version":"2.69","code":"34133-9","display":"Summarization of episode note"}],"text":"Summarization of episode note (LOINC 34133-9)"},
  "category":[{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/doc-typecodes","code":"RP","display":"Report"}],"text":"Clinical report"}],
  "subject":{"reference":"Patient/pat-5678","display":"Jean Martin"},
  "date":"2025-11-09T10:30:00+01:00",
  "author":[{"reference":"Practitioner/prac-dupont","display":"Dr. Dupont"}],
  "authenticator":{"reference":"Practitioner/prac-dupont","display":"Dr. Dupont"},
  "custodian":{"reference":"Organization/org-hopital-st-jean","display":"Hôpital Saint-Jean"},
  "description":"Synthèse de l'épisode clinique - dossier 1234",
  "content":[{"attachment":{"contentType":"application/pdf","language":"fr-FR","data":"JVBERi0xLjQKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwgL0xlbmd0aCAxMSAwIFIgL0ZpbHRlciAvRmxhdGVEZWNvZGUgPj4Kc3RyZWFtCnicK0nMS8xNVShJLEnVyEktLgEAOw0FDQoKZW5kc3RyZWFtCmVuZG9iagoKMTIgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAxMyAwIFIgL01lZGlhQm94IFswIDAgNjEyIDc5Ml0gL1Jlc291cmNlcyA8PCA+PiAvQ29udGVudHMgNCAwIFIgPj4KZW5kb2JqCgoKMTMgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFsgMTIgMCBSIF0gL0NvdW50IDEgPj4KZW5kb2JqCgoKMyAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMTMgMCBSID4+CmVuZG9iagoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDExIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE0MiAwMDAwMCBuIAp0cmFpbGVyCjw8IC9Sb290IDMgMCBSIC9JRCBbIDxFQ0E1OTY5NzQ5MUIyOTA4NTg5MThGRkZGMENFRThBRj48RUM5Njk3NDkxQjI5MDg1ODkxOEZGRkYwQ0VFOEFFPl0gPj4Kc3RhcnR4cmVmCjE2OApFT0YK","title":"Synthese_episode_1234.pdf","url":"Binary/doc-1234.pdf","creation":"2025-11-09T10:30:00+01:00"},"format":{"system":"urn:ietf:bcp:13","code":"application/pdf","display":"PDF"}}],
  "context":{"encounter":[{"reference":"Encounter/enc-9012","display":"Consultation externe"}],"period":{"start":"2025-11-08T09:00:00+01:00","end":"2025-11-09T10:00:00+01:00"},"facilityType":{"coding":[{"system":"http://snomed.info/sct","code":"394709006","display":"Hospital"}],"text":"Hôpital"},"practiceSetting":{"coding":[{"system":"http://snomed.info/sct","code":"408443003","display":"General medicine"}],"text":"Médecine générale"},"sourcePatientInfo":{"reference":"Patient/pat-5678","display":"Jean Martin"},"related":[{"identifier":{"system":"urn:ietf:rfc:3986","value":"urn:uuid:doc-previous-0001"}}]},
  "identifier":[{"use":"official","system":"urn:oid:1.2.250.1.72","value":"DOC-2025-1234"}],
  "masterIdentifier":{"system":"urn:oid:1.2.250.1.72","value":"MASTER-DOC-2025-1234"},
  "text":{"status":"generated","div":"<div>DocumentReference: Synthèse de l'épisode (LOINC 34133-9) - Hôpital Saint-Jean</div>"}
}
$json$::jsonb
)
RETURNING id;

-- 3) Insérer le document MOS lié
INSERT INTO document_mos (type_document_id, metadonnee_id)
VALUES (
  (SELECT id FROM mos_code WHERE valeur = '34133-9' LIMIT 1),
  (SELECT id FROM mos_document_metadonnee ORDER BY created_at DESC LIMIT 1)
)
RETURNING id;
