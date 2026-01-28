// initialize all routes
import { Router } from "express";
import callRoutes from "./CallRoutes";
import twilioWebhookRoutes from "./twilioWebhookRoutes";
import authRoutes from "./AuthRoutes";

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/calls', callRoutes);
router.use('/webhooks/twilio', twilioWebhookRoutes);

export default router;
