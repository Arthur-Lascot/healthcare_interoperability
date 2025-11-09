import { Router, Request, Response } from "express";
import * as FileController from "../controllers/files_controllers"
import { asyncHandler } from "../middlewares/async_handler";

const router = Router();

router.get("/DocumentReference/:uuid", asyncHandler(FileController.getDocumentReferenceController)); 

router.post("/document", asyncHandler(FileController.createFileController));

export default router;