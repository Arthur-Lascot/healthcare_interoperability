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
-    **Appointment**: Représente un Rendez-vous.
-    **ServiceRequest**: Représente une requete pour un service tel qu'un examen biologique.

## Choix des structures MOS

-    **3.2.3 Classe "Document"**: Représente un document, non modifiable.
-    **2.14.18 Classe "Patientele"**: Une patientèle est un ensemble de patients présentant des caractéristiques permettant d'orienter leur prise en charge par une structure de santé.
-    **2.1.4 Classe "Professionnel"**: Donnée identifiante d'un professionnel de santé.
-    **2.12.3 Classe "RendezVous"**: Représente un rendez-vous.

## Architecture

-   **Frontend** : application web (auth, recherche, upload).
-   **Backend** : API REST multi-layer conforme FHIR (gestion des ressources).
-   **Base de données metadata** : PostgreSQL
-   - Structures de données respectant le MOS + JSONB pour les ressources FHIR 
    - Stockage binaire pour les documents.
-   **Base de données fichier** : Mongodb
-   - Permet le stockage de pdf que nous pourrons lier avec les objets de la base précédente.
-   **Auth & Access Control** : Keycloak et matrice d'habilitation.

## Ressources utilisés

- [mos-nos](https://esante.gouv.fr/interoperabilite/mos-nos)
- [FHIRr4](https://hl7.org/fhir/R4/)

## Lancer le projet en dev
- Avoir les variables d'environnement suivantes :
-    - KEYCLOAK_ADMIN=admin
     -  KEYCLOAK_ADMIN_PASSWORD=admin
     - KEYCLOAK_JWKS_URI=http://keycloak:8080/realms/healthcare/protocol/openid-connect/certs

     - BACKEND_PORT=3002
     - BACKEND_PORT_MEDECIN=3005
     - BACKEND_PORT_HUB=3003
     - BACKEND_PORT_LABO=3004

     - DB_HOST=db
     - DB_PORT=5432
     - DB_PORT_MEDECIN=5435
     - DB_PORT_HUB=5433
     - DB_PORT_LABO=5434
     - DB_USER=postgres
     - DB_PASSWORD=motdepasse
     - DB_NAME=document

     - MONGO_USER=mongouser
     - MONGO_PASSWORD=mongopass123
     - MONGO_PORT_MEDECIN=27020
     - MONGO_PORT_HUB=27018
     - MONGO_PORT_LABO=27019

-   cd healthcare_interoperability
-   docker-compose up -d
-   se connecter au front sur le port http://localhost:3010 (Interface medecin)
-   se connecter au front sur le port http://localhost:3010 (Interface HUB)
-   se connecter au front sur le port http://localhost:3010 (Interface LABO)

## Tester le projet

- Une fois connecté à l'interface medecin s'identifier (login : test, mdp : test) (privilege medecin)
- Upload un PDF dans la section gestion des PDF
- Copier son Id
- Aller dans la section Créer compte-rendu, y changer l'ID avec celle que vous venez de copier
- Envoyer le CR
- Connecter vous à l'interface HUB
- Allez sur la section Lister les documents, vous devriez voir deux documents (Votre CR ainsi qu'un fichier placeHolder)
- Maintenant vous pouvez upload un pdf de demande d'analyse depuis l'interface medecin et en copier son ID
- Puis allez dans la section demande analyse et changer y l'ID avec celle que vous venez de copier
- Vous pouvez allez dans l'interface HUB et LABO pour y retrouver le fichier de demande d'analyse
- Dans l'interface mdecin vous devriez avoir un nouveau fichier resultat d'analyse, il en va de même pour le hub
  
## Utilisation de L'IA

- Le frontend n'ayant pas été jugé comme le point important de ce projet a été majoritairement généré sauf pour s'assurer que la communication des formulaires soit bien en FHIR.
- Pour le backend voici une requête que j'ai faites pour comprendre comment réellement implémenté le MOS (au-delà de la structure présente dans la documentation officielle) :
  - **Question :** Vis à vis de MOS la classe Document est définis tel quel :  
    Nom Description typeDocument : [0..1] Code Type de document. meatdonnee : [0..1] Metadonnee Informations relatives à la gestion des classes et des données.  
    Je me demande comment comprendre meatdonnée dans le context du MOS
  - **Réponse :** Dans le MOS, métadonnée = tout ce qui décrit le document sans être son contenu.

    Typiquement :

    - titre  
    - auteur / producteur  
    - date de création  
    - date de modification  
    - format (PDF, CDA, image…)  
    - taille  
    - statut (validé, archivé, annulé…)  
    - identifiants techniques  
    - droits / confidentialité  
    - localisation du fichier  

    En MOS, la métadonnée sert surtout à gérer le document (cycle de vie, archivage, contexte), alors que typeDocument décrit ce que le document est.

    Si tu veux, je peux faire un parallèle direct : FHIR DocumentReference → MOS metadonnee.

  - **Question :** La question est : les métadonnées sont elles standardisées ou l'implémentation est au choix ?
  - **Réponse :** Elles ne sont pas totalement standardisées : le MOS définit le concept de métadonnée, mais pas une liste figée et obligatoire.

    👉 Le contenu exact des métadonnées dépend donc de ton implémentation, tant que tu restes cohérent avec le modèle MOS.

    **Ce qui est standardisé :**
    - Le fait qu’un document possède un bloc “métadonnée”.
    - Le rôle général : décrire et gérer le document (cycle de vie, contexte, infos techniques).

    **Ce qui n’est pas standardisé :**
    - La liste précise des champs.
    - Le niveau de détail.
    - Le vocabulaire utilisé.

    Chaque éditeur choisit comment remplir cette structure tant que ça respecte le cadre logique du MOS.

    **Bonne pratique**  
    S’inspirer de modèles déjà normalisés (par ex. les champs de DocumentReference côté FHIR) pour que ton bloc “métadonnée” reste cohérent, lisible, et interopérable.
