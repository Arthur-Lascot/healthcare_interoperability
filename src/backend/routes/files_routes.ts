import { Router, Request, Response } from "express";

const router = Router();

router.get("/api/read", (_req: Request, res: Response) => {
  res.json({ message: "pong" });
});

router.post("/api/save", (req: Request, res: Response) => {
  res.json({ received: req.body });
});

export default router;