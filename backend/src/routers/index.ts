import { Router } from "express";
import { AuthRouter } from "./auth.routes";
import { BookingRouter } from "./booking.route";
import { ParkingRouter } from "./parking.routes";
import { UsersRouter } from "./user.routes";
import { PaymentRouter } from "./payment.routes";
import { VehicleRouter } from "./vehicle.routes";



const router  = Router()

router.use("/auth", AuthRouter)
router.use("/bookings",BookingRouter)
router.use("/parking", ParkingRouter)
router.use('/users', UsersRouter);
router.use('/payments', PaymentRouter);
router.use('/vehicles', VehicleRouter);
router.use('/bookings', BookingRouter);



export default router