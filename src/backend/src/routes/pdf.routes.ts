import { Router } from "express";
import * as PDFController from "../controllers/pdf_controllers";
import { asyncHandler } from "../middlewares/async_handler";
import multer from "multer";

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Upload a PDF
router.post(
  "/upload",
  upload.single("file"),
  asyncHandler(PDFController.uploadPDFController)
);

// Download a PDF by ID
router.get(
  "/download/:pdfId",
  asyncHandler(PDFController.downloadPDFController)
);

// Get PDF metadata
router.get(
  "/metadata/:pdfId",
  asyncHandler(PDFController.getPDFMetadataController)
);

// Delete a PDF
router.delete(
  "/:pdfId",
  asyncHandler(PDFController.deletePDFController)
);

export default router;
