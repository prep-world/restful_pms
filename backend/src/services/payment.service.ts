// services/payment.service.ts
import {
   PrismaClient,
   Payment,
   PaymentMethod,
} from "@prisma/client";
import { BadRequestError, NotFoundError } from "../utils/helpers";

const prisma = new PrismaClient();

class PaymentService {
   async createPayment(
      amount: number,
      bookingId: string | null,
      userId: string,
      method: PaymentMethod
   ): Promise<Payment> {
      // If payment is for a booking, verify the booking exists
      if (bookingId) {
         const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
         });

         if (!booking) {
            throw new NotFoundError("Booking not found");
         }
      }

      return prisma.payment.create({
         data: {
            amount,
            //@ts-ignore
            bookingId,
            userId,
            method,
            status: "PENDING",
         },
      });
   }

   async processPayment(paymentId: string): Promise<Payment> {
      // In a real app, this would integrate with a payment gateway
      return prisma.$transaction(async (tx) => {
         const payment = await tx.payment.findUnique({
            where: { id: paymentId },
         });

         if (!payment) {
            throw new NotFoundError("Payment not found");
         }

         if (payment.status !== "PENDING") {
            throw new BadRequestError("Payment already processed");
         }

         // Simulate payment processing
         const isSuccess = Math.random() > 0.1; // 90% success rate for demo

         const updatedPayment = await tx.payment.update({
            where: { id: paymentId },
            data: {
               status: isSuccess ? "COMPLETED" : "FAILED",
            },
         });

         // If payment was for a booking and succeeded, mark booking as paid
         if (isSuccess && payment.bookingId) {
            await tx.booking.update({
               where: { id: payment.bookingId },
               data: {
                  status: "COMPLETED",
               },
            });
         }

         return updatedPayment;
      });
   }

   async getPaymentById(id: string): Promise<Payment | null> {
      return prisma.payment.findUnique({
         where: { id },
         include: {
            booking: true,
            user: {
               select: {
                  id: true,
                  firstName: true,
                  lastName:true,
                  email: true,
               },
            },
         },
      });
   }

   async getUserPayments(userId: string): Promise<Payment[]> {
      return prisma.payment.findMany({
         where: { userId },
         include: {
            booking: {
               include: {
                  parkingSlot: true,
                  vehicle: true,
               },
            },
         },
         orderBy: {
            createdAt: "desc",
         },
      });
   }

   async getAllPayments(): Promise<Payment[]> {
      return prisma.payment.findMany({
         include: {
            booking: {
               include: {
                  parkingSlot: true,
                  vehicle: true,
               },
            },
            user: {
               select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
               },
            },
         },
         orderBy: {
            createdAt: "desc",
         },
      });
   }

   async refundPayment(paymentId: string): Promise<Payment> {
      return prisma.$transaction(async (tx) => {
         const payment = await tx.payment.findUnique({
            where: { id: paymentId },
         });

         if (!payment) {
            throw new NotFoundError("Payment not found");
         }

         if (payment.status !== "COMPLETED") {
            throw new BadRequestError(
               "Only completed payments can be refunded"
            );
         }

         // In a real app, this would integrate with a payment gateway
         const updatedPayment = await tx.payment.update({
            where: { id: paymentId },
            data: {
               status: "REFUNDED",
            },
         });

         return updatedPayment;
      });
   }
}

export default new PaymentService();
