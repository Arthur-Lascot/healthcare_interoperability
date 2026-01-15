import { ObjectId, Binary } from "mongodb";
import { getMongoDBInstance } from "../config/mongodbClient";
import { PDFUploadRequest, PDFUploadResponse, PDFDownloadResponse, PDFMetadata } from "../DTO/PDF";
import { ValidationError } from "../errors/AppError";
import client from "../config/postgresClient";
import crypto from "crypto";

export const uploadPDF = async (req: PDFUploadRequest, userId: string): Promise<PDFUploadResponse> => {
  const db = getMongoDBInstance();
  const pdfsCollection = db.collection("pdfs");

  try {
    // Validate input
    if (!req.file_name) {
      throw new ValidationError("Missing required fields: file_name ");
    }
    else if (!req.file_buffer) {
      throw new ValidationError("Missing required fields: file_buffer");
    }

    // Calculate checksum for file integrity
    const checksum = crypto
      .createHash("sha256")
      .update(req.file_buffer)
      .digest("hex");

    // Store PDF in MongoDB
    const pdfDoc = {
      file_name: req.file_name,
      file_size: req.file_buffer.length,
      mime_type: "application/pdf",
      content: req.file_buffer,
      uploaded_by: userId,
      created_at: new Date(),
      updated_at: new Date(),
      metadata: {
        checksum,
      },
    };

    const mongoResult = await pdfsCollection.insertOne(pdfDoc);
    const pdfId = mongoResult.insertedId.toString();

    return {
      pdf_id: pdfId,
      document_mos_id: "",
      file_name: req.file_name,
      download_link: `/api/pdf/download/${pdfId}`,
      created_at: new Date(),
    };
  } catch (error) {
    console.error("Error uploading PDF:", error);
    throw error;
  }
};

export const downloadPDF = async (pdfId: string): Promise<PDFDownloadResponse> => {
  const db = getMongoDBInstance();
  const pdfsCollection = db.collection("pdfs");

  try {
    // Validate MongoDB ObjectId format
    if (!ObjectId.isValid(pdfId)) {
      throw new ValidationError("Invalid PDF ID format");
    }

    const pdfDoc = await pdfsCollection.findOne({
      _id: new ObjectId(pdfId),
    });

    if (!pdfDoc) {
      throw new ValidationError("PDF not found");
    }

    // Convert MongoDB Binary to Buffer
    let fileBuffer: Buffer;
    if (pdfDoc.content instanceof Binary) {
      fileBuffer = Buffer.from(pdfDoc.content.buffer);
    } else if (Buffer.isBuffer(pdfDoc.content)) {
      fileBuffer = pdfDoc.content;
    } else {
      fileBuffer = Buffer.from(pdfDoc.content);
    }

    return {
      file_name: pdfDoc.file_name,
      file_buffer: fileBuffer,
      mime_type: pdfDoc.mime_type,
    };
  } catch (error) {
    console.error("Error downloading PDF:", error);
    throw error;
  }
};

export const deletePDF = async (pdfId: string): Promise<void> => {
  const db = getMongoDBInstance();
  const pdfsCollection = db.collection("pdfs");

  try {
    if (!ObjectId.isValid(pdfId)) {
      throw new ValidationError("Invalid PDF ID format");
    }

    const result = await pdfsCollection.deleteOne({
      _id: new ObjectId(pdfId),
    });

    if (result.deletedCount === 0) {
      throw new ValidationError("PDF not found");
    }

    // Also delete the reference from PostgreSQL
    await client.query(
      "DELETE FROM pdf_references WHERE mongodb_pdf_id = $1",
      [pdfId]
    );
  } catch (error) {
    console.error("Error deleting PDF:", error);
    throw error;
  }
};

export const getPDFMetadata = async (pdfId: string): Promise<PDFMetadata> => {
  const db = getMongoDBInstance();
  const pdfsCollection = db.collection("pdfs");

  try {
    if (!ObjectId.isValid(pdfId)) {
      throw new ValidationError("Invalid PDF ID format");
    }

    const pdfDoc = await pdfsCollection.findOne(
      { _id: new ObjectId(pdfId) },
      { projection: { content: 0 } }
    );

    if (!pdfDoc) {
      throw new ValidationError("PDF not found");
    }

    return {
      _id: pdfDoc._id.toString(),
      document_ref_id: pdfDoc.document_ref_id,
      file_name: pdfDoc.file_name,
      file_size: pdfDoc.file_size,
      mime_type: pdfDoc.mime_type,
      uploaded_by: pdfDoc.uploaded_by,
      created_at: pdfDoc.created_at,
      updated_at: pdfDoc.updated_at,
      checksum: pdfDoc.metadata?.checksum,
    };
  } catch (error) {
    console.error("Error retrieving PDF metadata:", error);
    throw error;
  }
};
