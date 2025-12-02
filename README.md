# Projet Santé -- Gestion et Interopérabilité des Documents

## Auteur

Arthur Oldrati et Gaetan Maronne

## Description

Ce projet est une application web permettant :
- La **consultation** et l'**upload** de documents de santé (PDF, DICOM, CDA, etc.).
- La **gestion des accès** via une [matrice d'accessibilité](https://www.dmp.fr/documents/d/dmp/matrice-habilitation).
- L'**interopérabilité** avec d'autres systèmes grâce à l'usage du standard d'échange de donné **FHIR r4**.

Le système gére :
- Les **documents** (stockés en `DocumentReference` + `Binary`).


## Diagramme de flux de donnée

![DFD](https://github.com/user-attachments/assets/e4ebbe53-341e-4d0b-b95b-f6ecef81e1b1)


## Choix des ressources FHIR nécessaire

-    **DocumentReference**: Stock les métadatas lié a un document.
-    **Bundle**: Réprésente une collection de ressources FHIR (Utilisé ici pour contenir les informations de plusieurs documents).
-    **Practitioner**: Représente un praticien.
-    **Patient**: Représente un Patient.

## Choix des structures MOS

-    **3.2.3 Classe "Document"**: Représente un document, non modifiable.
-    **2.14.18 Classe "Patientele"**: Une patientèle est un ensemble de patients présentant des caractéristiques permettant d'orienter leur prise en charge par une structure de santé.
-    **2.1.4 Classe "Professionnel"**: Donnée identifiante d'un professionnel de santé.

## Architecture

-   **Frontend** : application web (auth, recherche, upload).
-   **Backend** : API REST multi-layer conforme FHIR (gestion des ressources).
-   **Base de données** : PostgreSQL
-   - Structures de données respectant le MOS + JSONB pour les ressources FHIR 
    - Stockage binaire pour les documents.
-   **Auth & Access Control** : Keycloak et matrice d'habilitation.

## Ressources utilisés

- [mos-nos](https://esante.gouv.fr/interoperabilite/mos-nos)
- [FHIRr4](https://hl7.org/fhir/R4/)

## Lancer le projet en dev
- Avoir les variables d'environnement suivantes :
-    - KEYCLOAK_ADMIN=admin
     - KEYCLOAK_ADMIN_PASSWORD=admin
     - KEYCLOAK_JWKS_URI=http://keycloak:8080/realms/healthcare/protocol/openid-connect/certs

     - BACKEND_PORT=3002

     - DB_HOST=localhost
     - DB_PORT=5432
     - DB_USER=postgres
     - DB_PASSWORD=motdepasse
     - DB_NAME=document

-   cd healthcare_interoperability
-   docker-compose up -d
-   se connecter au front sur le port http://localhost:3000
