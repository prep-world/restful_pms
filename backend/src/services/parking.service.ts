// @ts-nocheck
import {
   PrismaClient,
   ParkingSlot,
   VehicleType,
   Booking,
} from "@prisma/client";
import { CreateBookingDto, ExtendBookingDto } from "../types/custom.types";

const prisma = new PrismaClient();

class ParkingService {
   async getAllParkingSlots(): Promise<ParkingSlot[]> {
      return prisma.parkingSlot.findMany();
   }

   async getAvailableSlots(_vehicleType: VehicleType): Promise<ParkingSlot[]> {
      return prisma.parkingSlot.findMany({
         where: {
            isAvailable: true,
            // You can add vehicle type specific logic here
         },
      });
   }

   async bookSlot(bookingData: CreateBookingDto): Promise<Booking> {
      const { parkingSlotId, vehicleId, startTime } = bookingData;

      // Check if slot is available
      const slot = await prisma.parkingSlot.findUnique({
         where: { id: parkingSlotId },
      });

      if (!slot || !slot.isAvailable) {
         throw new Error("Parking slot is not available");
      }

      // Start transaction
      return prisma.$transaction(async (tx) => {
         // Create booking
         const booking = await tx.booking.create({
            data: {
               parkingSlotId,
               vehicleId,
               startTime: new Date(startTime),
               status: "ACTIVE",
            },
         });

         // Mark slot as occupied
         await tx.parkingSlot.update({
            where: { id: parkingSlotId },
            data: {
               isAvailable: false,
               vehicleId,
            },
         });

         return booking;
      });
   }

   async extendBooking(extendData: ExtendBookingDto): Promise<Booking> {
      const { bookingId, additionalHours } = extendData;

      const booking = await prisma.booking.findUnique({
         where: { id: bookingId },
      });

      if (!booking) {
         throw new Error("Booking not found");
      }

      const newEndTime = new Date(
         (booking.endTime ? booking.endTime : new Date()).getTime() +
            additionalHours * 60 * 60 * 1000
      );

      return prisma.booking.update({
         where: { id: bookingId },
         data: {
            endTime: newEndTime,
         },
      });
   }

   async releaseSlot(bookingId: string): Promise<Booking> {
      const booking = await prisma.booking.findUnique({
         where: { id: bookingId },
      });

      if (!booking) {
         throw new Error("Booking not found");
      }

      // Start transaction
      return prisma.$transaction(async (tx) => {
         // Update booking
         const updatedBooking = await tx.booking.update({
            where: { id: bookingId },
            data: {
               endTime: new Date(),
               status: "COMPLETED",
            },
         });

         // Mark slot as available
         await tx.parkingSlot.update({
            where: { id: booking.parkingSlotId },
            data: {
               isAvailable: true,
               vehicleId: null,
            },
         });

         return updatedBooking;
      });
   }
}

export default new ParkingService();
