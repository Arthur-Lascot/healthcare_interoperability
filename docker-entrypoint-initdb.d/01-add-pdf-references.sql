-- Create table to link DocumentReference with PDFs in MongoDB

CREATE TABLE IF NOT EXISTS pdf_references (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_mos_id uuid NOT NULL REFERENCES document_mos(id) ON DELETE CASCADE,
    mongodb_pdf_id text NOT NULL,  -- ObjectId from MongoDB
    file_name text NOT NULL,
    file_size bigint,
    mime_type text DEFAULT 'application/pdf',
    uploaded_by text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON pdf_references (document_mos_id);
CREATE INDEX ON pdf_references (mongodb_pdf_id);
CREATE INDEX ON pdf_references (created_at);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_pdf_references_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pdf_references_update_timestamp
BEFORE UPDATE ON pdf_references
FOR EACH ROW
EXECUTE FUNCTION update_pdf_references_timestamp();
