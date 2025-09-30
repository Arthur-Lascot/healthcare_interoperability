# Projet Santé -- Gestion et Interopérabilité des Documents

## Description

Ce projet est une application web permettant : - La **consultation** et
l'**upload** de documents de santé (PDF, DICOM, CDA, etc.). - La
**gestion des accès** via une matrice d'accessibilité (contrôle par
utilisateur/ rôle). - L'**interopérabilité** avec d'autres systèmes
grâce à l'usage des standards **FHIR**.

Le système sépare : - Les **documents** (stockés en
`DocumentReference` + `Binary`). - Les **données cliniques structurées**
(stockées en ressources FHIR comme `Observation`,
`MedicationStatement`...).

## Architecture

-   **Frontend** : application web (auth, recherche, upload).
-   **Backend** : API REST conforme FHIR (gestion des ressources).
-   **Base de données** : PostgreSQL
    -   JSONB pour les ressources FHIR (`DocumentReference`,
        `Observation`, etc.)
    -   Stockage binaire pour les documents (via `Binary`).
-   **Auth & Access Control** : Keycloak et matrice d'habilitation.

## Standards utilisés

-   **FHIR R4**
    -   `DocumentReference` : métadonnées d'un document de santé.
    -   `Binary` : contenu binaire (PDF, DICOM, CDA).
    -   `Patient`, `Practitioner` : gestion des patients et
        utilisateurs.
-   **Formats de documents** : PDF, DICOM, CDA.

## Workflow typique

1.  L'utilisateur s'authentifie.
2.  Il upload un document → création d'un `Binary` + d'un
    `DocumentReference`.
3.  Les recherches se font via les métadonnées (`DocumentReference`).
4.  Le téléchargement récupère le `Binary`.
5.  Les données structurées (ex. résultats biologiques) sont stockées
    séparément sous forme de ressources FHIR (`Observation`).

## Lancer le projet en dev
- Avoir les variables d'environnement suivantes :
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin
KEYCLOAK_JWKS_URI=http://keycloak:8080/realms/healthcare/protocol/openid-connect/certs

BACKEND_PORT=3002

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=motdepasse
DB_NAME=document

-   cd healthcare_interoperability
-   docker-compose up -d
-   se connecter au front sur le port http://localhost:3000
