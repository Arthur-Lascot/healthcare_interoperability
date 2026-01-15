// Initialize MongoDB for PDF storage
db = db.getSiblingDB('admin');

// Create user for pdf_storage database if not already present
const mongoUser = process.env.MONGO_USER || 'mongouser';
const mongoPassword = process.env.MONGO_PASSWORD || 'mongopass123';
if (!db.getUser(mongoUser)) {
  db.createUser({
    user: mongoUser,
    pwd: mongoPassword,
    roles: [{ role: 'readWrite', db: 'pdf_storage' }],
  });
  print(`Created user ${mongoUser}`);
} else {
  print(`User ${mongoUser} already exists`);
}

db = db.getSiblingDB('pdf_storage');

// Create collection for storing PDF documents if absent
if (!db.getCollectionNames().includes('pdfs')) {
  db.createCollection('pdfs');
  print('Created collection pdfs');
} else {
  print('Collection pdfs already exists');
}

// Create indexes for better query performance
db.pdfs.createIndex({ created_at: 1 });
db.pdfs.createIndex({ file_name: 1 });
db.pdfs.createIndex({ uploaded_by: 1 });

// Initialization complete
print('MongoDB PDF storage initialized successfully');
