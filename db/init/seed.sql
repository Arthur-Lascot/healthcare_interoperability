CREATE TABLE IF NOT EXISTS documents (
  uuid INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code INTEGER NOT NULL,
  class_code_display_name TEXT NOT NULL,
  loinc TEXT NOT NULL,
  type_code_display_name TEXT NOT NULL,
  content TEXT
);

INSERT INTO documents (code, class_code_display_name, loinc, type_code_display_name, content) VALUES
('11111111-1111-1111-1111-111111111111', 1001, 'Classe A', '1234-5', 'Type X', 'contenu test 1'),
(1002, 'Classe B', '6789-0', 'Type Y', 'contenu test 2')
ON CONFLICT DO NOTHING;
