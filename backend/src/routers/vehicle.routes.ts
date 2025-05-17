// routes/vehicle.routes.ts
import { Router } from 'express';
import vehicleController from '../controllers/vehicle.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Protected routes
router.post('/vehicles', authMiddleware, vehicleController.createVehicle);
router.get('/vehicles/me', authMiddleware, vehicleController.getMyVehicles);
router.get('/vehicles/:id', authMiddleware, vehicleController.getVehicleById);
router.put('/vehicles/:id', authMiddleware, vehicleController.updateVehicle);
router.delete('/vehicles/:id', authMiddleware, vehicleController.deleteVehicle);

export  {router as VehicleRouter};