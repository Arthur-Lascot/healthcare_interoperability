# Utiliser bash comme shell par défaut pour les instructions suivantes
FROM python:3.11-slim
WORKDIR /app
SHELL ["/bin/bash", "-c"]

# Installer les dépendances
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Installer l'utilitaire pour attendre la base
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Copier le code
COPY . .

# Script d'entrée : attendre la base, créer la table, puis lancer le script python
CMD until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do sleep 1; done; \
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c "CREATE TABLE IF NOT EXISTS habilitation (uuid SERIAL PRIMARY KEY, code TEXT, \"Intitulé classCodeDisplayName\" TEXT, LOINC TEXT, \"Intitulé\" TEXT, typeCodeDisplayName TEXT, contenu TEXT);"; \
    python excel_to_db.py
