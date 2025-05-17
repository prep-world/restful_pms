// routes/parking.routes.ts
import { Router } from "express";
import parkingController from "../controllers/parking.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { CreateBookingDto, ExtendBookingDto } from "../types/custom.types";
import { validationMiddleware } from "../middlewares/validation.middleware";

const router = Router();

// Public routes
router.get("/slots", parkingController.getParkingSlots);
router.get("/slots/available", parkingController.getAvailableSlots);

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
