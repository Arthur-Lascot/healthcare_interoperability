DROP TABLE IF EXISTS documents CASCADE;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE documents (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code INTEGER NOT NULL,
    class_code_display_name TEXT NOT NULL,
    loinc TEXT NOT NULL,
    type_code_display_name TEXT NOT NULL,
    content TEXT
);

INSERT INTO documents (code, class_code_display_name, loinc, type_code_display_name, content)
VALUES
    (1, 'Class A', '1234-5', 'Type X', 'Exemple 1'),
    (2, 'Class B', '6789-0', 'Type Y', 'Exemple 2');
