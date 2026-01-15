// Initialize MongoDB for PDF storage
db = db.getSiblingDB('admin');

// Create user for pdf_storage database
db.createUser({
  user: process.env.MONGO_USER || 'mongouser',
  pwd: process.env.MONGO_PASSWORD || 'mongopass123',
  roles: [
    { role: 'readWrite', db: 'pdf_storage' }
  ]
});

db = db.getSiblingDB('pdf_storage');

// Create collection for storing PDF documents
db.createCollection('pdfs');

// Create indexes for better query performance
db.pdfs.createIndex({ created_at: 1 });
db.pdfs.createIndex({ file_name: 1 });
db.pdfs.createIndex({ uploaded_by: 1 });

print('MongoDB initialized successfully');
  document_ref_id: "uuid-reference-to-postgres",
  file_name: "example.pdf",
  file_size: 0,
  mime_type: "application/pdf",
  content: BinData(0, ""),  // Binary data for PDF content
  uploaded_by: "user-id",
  created_at: new Date(),
  updated_at: new Date(),
  metadata: {
    checksum: "sha256-hash",
    pages: 0,
    language: "en"
  }
});

// Remove sample document
db.pdfs.deleteMany({ file_name: "example.pdf" });

print("MongoDB PDF storage initialized successfully");
