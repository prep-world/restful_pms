// routes/parking.routes.ts
import { Router } from "express";
import parkingController from "../controllers/parking.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import {
   CreateBookingDto,
   CreateParkingSlotDto,
   ExtendBookingDto,
} from "../types/custom.types";
import { validationMiddleware } from "../middlewares/validation.middleware";

const router = Router();

// Public routes
router.get("/slots", parkingController.getParkingSlots);
router.get("/slots/available", parkingController.getAvailableSlots);

// Add these routes before the export
router.post(
   "/slots",
   authMiddleware,
   roleMiddleware(["ADMIN"]),
   validationMiddleware(CreateParkingSlotDto),
   parkingController.createParkingSlot
);

router.post(
   "/slots/bulk",
   authMiddleware,
   roleMiddleware(["ADMIN"]),
   parkingController.createBulkParkingSlots
);

// Protected routes
router.post(
   "/book",
   authMiddleware,
   validationMiddleware(CreateBookingDto),
   parkingController.bookSlot
);

router.post(
   "/extend",
   authMiddleware,
   validationMiddleware(ExtendBookingDto),
   parkingController.extendBooking
);

router.post(
   "/release/:bookingId",
   authMiddleware,
   roleMiddleware(["ADMIN", "ATTENDANT"]),
   parkingController.releaseSlot
);

export { router as ParkingRouter };
