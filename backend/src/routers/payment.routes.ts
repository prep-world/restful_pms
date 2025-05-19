
import { Router } from "express";
import paymentController from "../controllers/payment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

// Protected routes
router.post("/", authMiddleware, paymentController.createPayment);
router.get("/me", authMiddleware, paymentController.getMyPayments);
router.get("/:id", authMiddleware, paymentController.getPaymentById);
router.post(
   "/:id/process",
   authMiddleware,
   roleMiddleware(["ADMIN", "ATTENDANT"]),
   paymentController.processPayment
);

// Admin-only routes
router.get(
   "/",
   authMiddleware,
   roleMiddleware(["ADMIN"]),
   paymentController.getAllPayments
);
router.post(
   "/:id/refund",
   authMiddleware,
   roleMiddleware(["ADMIN"]),
   paymentController.refundPayment
);

export { router as PaymentRouter };
