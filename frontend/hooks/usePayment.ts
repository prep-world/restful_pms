import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";

// Enums (copied from your schema.prisma but moved here for frontend use)
export enum PaymentMethod {
   CASH = "CASH",
   CARD = "CARD",
   MOBILE = "MOBILE",
}

export enum PaymentStatus {
   PENDING = "PENDING",
   COMPLETED = "COMPLETED",
   FAILED = "FAILED",
   REFUNDED = "REFUNDED",
}

// Types
export interface Payment {
   id: string;
   amount: number;
   bookingId: string | null;
   userId: string;
   method: PaymentMethod;
   status: PaymentStatus;
   createdAt: string;
   updatedAt: string;
   booking?: {
      id: string;
      parkingSlot: {
         id: string;
         number: string;
      };
      vehicle: {
         id: string;
         plateNumber: string;
      };
   };
   user?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
   };
}

export interface CreatePaymentDto {
   amount: number;
   bookingId?: string;
   method: PaymentMethod;
}

// API call functions
const fetchMyPayments = () => {
   return handleApiRequest(() => authorizedAPI.get("/payment/me"));
};

const fetchPaymentById = (id: string) => {
   return handleApiRequest(() => authorizedAPI.get(`/payment/${id}`));
};

const fetchAllPayments = () => {
   return handleApiRequest(() => authorizedAPI.get("/payment"));
};

const createNewPayment = (paymentData: CreatePaymentDto) => {
   return handleApiRequest(() => authorizedAPI.post("/payment", paymentData));
};

const processExistingPayment = (id: string) => {
   return handleApiRequest(() => authorizedAPI.post(`/payment/${id}/process`));
};

const refundExistingPayment = (id: string) => {
   return handleApiRequest(() => authorizedAPI.post(`/payment/${id}/refund`));
};

// React Query hooks
export const useMyPayments = () => {
   return useQuery({
      queryKey: ["myPayments"],
      queryFn: fetchMyPayments,
      onError: (error: any) => {
         console.error("Error fetching user payments:", error);
      },
   });
};

export const usePayment = (id?: string) => {
   return useQuery({
      queryKey: ["payment", id],
      queryFn: () => fetchPaymentById(id!),
      enabled: !!id,
      onError: (error: any) => {
         console.error(`Error fetching payment ${id}:`, error);
      },
   });
};

export const useAllPayments = () => {
   return useQuery({
      queryKey: ["allPayments"],
      queryFn: fetchAllPayments,
      onError: (error: any) => {
         console.error("Error fetching all payments:", error);
      },
   });
};

export const useCreatePayment = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: createNewPayment,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["myPayments"] });
      },
      onError: (error: any) => {
         console.error("Error creating payment:", error);
      },
   });
};

export const useProcessPayment = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: processExistingPayment,
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ["payment", variables] });
         queryClient.invalidateQueries({ queryKey: ["myPayments"] });
         queryClient.invalidateQueries({ queryKey: ["allPayments"] });
         queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      },
      onError: (error: any) => {
         console.error("Error processing payment:", error);
      },
   });
};

export const useRefundPayment = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: refundExistingPayment,
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ["payment", variables] });
         queryClient.invalidateQueries({ queryKey: ["myPayments"] });
         queryClient.invalidateQueries({ queryKey: ["allPayments"] });
      },
      onError: (error: any) => {
         console.error("Error refunding payment:", error);
      },
   });
};

// Utility functions
export const getPaymentMethodLabel = (method: PaymentMethod) => {
   switch (method) {
      case PaymentMethod.CASH:
         return "Cash";
      case PaymentMethod.CARD:
         return "Card";
      case PaymentMethod.MOBILE:
         return "Mobile Payment";
      default:
         return "Unknown";
   }
};

export const getPaymentStatusLabel = (status: PaymentStatus) => {
   switch (status) {
      case PaymentStatus.PENDING:
         return "Pending";
      case PaymentStatus.COMPLETED:
         return "Completed";
      case PaymentStatus.FAILED:
         return "Failed";
      case PaymentStatus.REFUNDED:
         return "Refunded";
      default:
         return "Unknown";
   }
};

export const getPaymentStatusColor = (status: PaymentStatus) => {
   switch (status) {
      case PaymentStatus.PENDING:
         return "orange";
      case PaymentStatus.COMPLETED:
         return "green";
      case PaymentStatus.FAILED:
         return "red";
      case PaymentStatus.REFUNDED:
         return "blue";
      default:
         return "gray";
   }
};
