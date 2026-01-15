export interface PDFUploadRequest {
  document_mos_id?: string;
  file_name: string;
  file_buffer: Buffer;
  uploaded_by?: string;
}

export interface PDFUploadResponse {
  pdf_id: string;
  document_mos_id: string;
  file_name: string;
  download_link: string;
  created_at: Date;
}

export interface PDFDownloadResponse {
  file_name: string;
  file_buffer: Buffer;
  mime_type: string;
}

export interface PDFMetadata {
  _id: string;
  document_ref_id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  uploaded_by?: string;
  created_at: Date;
  updated_at: Date;
  checksum?: string;
}
