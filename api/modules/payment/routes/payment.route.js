import { Router } from "express";
import { protectRoute } from "../../../middlewares/auth.middleware.js";
import {
  createPaymentIntent,
  handleWebhook,
} from "../controller/payment.controller.js";

const router = Router();

router.post("/create-intent", protectRoute, createPaymentIntent);

// No auth needed - Stripe validates via signature
router.post("/webhook", handleWebhook);

export default router;
