// controllers/parking.controller.ts
import { Request, Response } from "express";
import parkingService from "../services/parking.service";
import { CreateBookingDto, ExtendBookingDto } from "../types/custom.types";

class ParkingController {
   async getParkingSlots(_req: Request, res: Response) {
      try {
         const slots = await parkingService.getAllParkingSlots();
         res.json(slots);
      } catch (error) {
         res.status(500).json({ message: error.message });
      }
   }

   async createParkingSlot(req: Request, res: Response) {
      try {
         const { number, floor, isAvailable } = req.body;
         const slot = await parkingService.createParkingSlot(
            number,
            floor,
            isAvailable
         );
         res.status(201).json(slot);
      } catch (error) {
         res.status(400).json({ message: error.message });
      }
   }

   async createBulkParkingSlots(req: Request, res: Response) {
  try {
    const { slots } = req.body;
    if (!Array.isArray(slots)) {
      throw new Error('Slots must be an array');
    }
    const result = await parkingService.createBulkParkingSlots(slots);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

   async getAvailableSlots(req: Request, res: Response) {
      try {
         const { vehicleType } = req.query;
         const slots = await parkingService.getAvailableSlots(
            vehicleType as any
         );
         res.json(slots);
      } catch (error) {
         res.status(500).json({ message: error.message });
      }
   }

   async bookSlot(req: Request, res: Response) {
      try {
         const bookingData: CreateBookingDto = req.body;
         const booking = await parkingService.bookSlot(bookingData);
         res.status(201).json(booking);
      } catch (error) {
         res.status(400).json({ message: error.message });
      }
   }

   async extendBooking(req: Request, res: Response) {
      try {
         const extendData: ExtendBookingDto = req.body;
         const booking = await parkingService.extendBooking(extendData);
         res.json(booking);
      } catch (error) {
         res.status(400).json({ message: error.message });
      }
   }

   async releaseSlot(req: Request, res: Response) {
      try {
         const { bookingId } = req.params;
         const booking = await parkingService.releaseSlot(bookingId);
         res.json(booking);
      } catch (error) {
         res.status(400).json({ message: error.message });
      }
   }
}

export default new ParkingController();
