// routes/booking.routes.ts
import { Router } from 'express';
import bookingController from '../controllers/booking.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

// Protected routes
router.get('/bookings/me', authMiddleware, bookingController.getMyBookings);
router.get('/bookings/:id', authMiddleware, bookingController.getBookingById);
router.post(
  '/bookings/:id/cancel',
  authMiddleware,
  bookingController.cancelBooking
);

// Admin-only routes
router.get(
  '/bookings',
  authMiddleware,
  roleMiddleware(['ADMIN', 'ATTENDANT']),
  bookingController.getAllBookings
);

export {router as BookingRouter}