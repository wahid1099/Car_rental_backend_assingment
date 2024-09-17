import { Router } from "express";
import { paymentConfirmationController } from "./Payment.controller";

const router = Router();

router.post("/confirmations", paymentConfirmationController);

export const paymentRoutes = router;
