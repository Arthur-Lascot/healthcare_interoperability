import { Request, Response } from "express";
import * as PDFService from "../services/pdf_services";
import { ValidationError } from "../errors/AppError";
import { PDFUploadRequest } from "../DTO/PDF";

export const uploadPDFController = async (req: Request, res: Response): Promise<Response> => {
  if (!req.userId) {
    req.log.warn({ path: req.path }, "No user ID found");
    throw new ValidationError("No user ID found for user");
  }

  if (!req.file) {
    throw new ValidationError("No file provided");
  }

  const pdfUploadRequest: PDFUploadRequest = {
    document_mos_id: "",
    file_name: req.file.originalname,
    file_buffer: req.file.buffer,
  };

  const result = await PDFService.uploadPDF(pdfUploadRequest, req.userId);

  res.statusCode = 201;
  return res.json({
    success: true,
    data: result,
  });
};

export const downloadPDFController = async (req: Request, res: Response): Promise<void> => {
  const { pdfId } = req.params;

  if (!pdfId) {
    throw new ValidationError("PDF ID is required");
  }

  const pdfData = await PDFService.downloadPDF(pdfId);

  res.setHeader("Content-Type", pdfData.mime_type);
  res.setHeader("Content-Disposition", `attachment; filename="${pdfData.file_name}"`);
  res.setHeader("Content-Length", Buffer.byteLength(pdfData.file_buffer));

  res.send(pdfData.file_buffer);
};

export const getPDFMetadataController = async (req: Request, res: Response): Promise<Response> => {
  const { pdfId } = req.params;

  if (!pdfId) {
    throw new ValidationError("PDF ID is required");
  }

  const metadata = await PDFService.getPDFMetadata(pdfId);

  res.statusCode = 200;
  return res.json({
    success: true,
    data: metadata,
  });
};

export const deletePDFController = async (req: Request, res: Response): Promise<Response> => {
  const { pdfId } = req.params;

  if (!pdfId) {
    throw new ValidationError("PDF ID is required");
  }

  await PDFService.deletePDF(pdfId);

  res.statusCode = 200;
  return res.json({
    success: true,
    message: "PDF deleted successfully",
  });
};
