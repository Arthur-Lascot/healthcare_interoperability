import { Router, Request, Response } from "express";
import * as FileController from "../controllers/files_controllers"
import { asyncHandler } from "../middlewares/async_handler";

const router = Router();

router.get("/file/:uuid", FileController.getFileController); 

router.post("/save", (req: Request, res: Response) => {
  res.json({ received: req.body });
});

export default router;