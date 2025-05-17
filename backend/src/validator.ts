import { z } from "zod";
import { Role, BusType, BookingStatus } from "@prisma/client";

// User Validation
export const userSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z
    .enum([Role.USER, Role.ADMIN, Role.COMPANY_ADMIN])
    .optional()
    .default(Role.USER)
    .transform((val:any) => val as Role),
});

export const validateUser = (data: unknown) => {
  const result = userSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

// Company Validation
export const companySchema = z.object({
  name: z.string().min(3, "Company name must be at least 3 characters"),
  description: z.string().optional(),
  logo: z.string().url("Invalid logo URL").optional(),
  adminId: z.string().uuid("Invalid admin ID"),
});

export const validateCompany = (data: unknown) => {
  const result = companySchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

// Bus Validation
export const busSchema = z.object({
  plateNumber: z.string().min(5, "Plate number must be at least 5 characters"),
  type: z.enum([BusType.STANDARD, BusType.DELUXE, BusType.LUXURY]),
  capacity: z.number().int().positive("Capacity must be a positive integer"),
  companyId: z.string().uuid("Invalid company ID"),
});

export const validateBus = (data: unknown) => {
  const result = busSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

// Route Validation
export const routeSchema = z.object({
  origin: z.string().min(2, "Origin must be at least 2 characters"),
  destination: z.string().min(2, "Destination must be at least 2 characters"),
  distance: z.number().positive("Distance must be a positive number"),
  duration: z.number().positive("Duration must be a positive number"),
  companyId: z.string().uuid("Invalid company ID"),
});

export const validateRoute = (data: unknown) => {
  const result = routeSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

// Schedule Validation
export const scheduleSchema = z.object({
  routeId: z.string().uuid("Invalid route ID"),
  busId: z.string().uuid("Invalid bus ID"),
  departure: z.coerce.date().refine(
    (date: Date) => date > new Date(),
    "Departure must be in the future"
  ),
  arrival: z.coerce.date().refine(
    (date: Date) => date > new Date(),
    "Arrival must be in the future"
  ),
  price: z.number().positive("Price must be a positive number"),
  availableSeats: z.number().int().nonnegative("Available seats must be a non-negative integer").optional(),
}).refine(
  (data: { departure: Date; arrival: Date }) => data.arrival > data.departure,
  "Arrival must be after departure"
);

export const validateSchedule = (data: unknown) => {
  const result = scheduleSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

// Booking Validation
export const bookingSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  scheduleId: z.string().uuid("Invalid schedule ID"),
  seats: z.number().int().positive("Seats must be a positive integer"),
  status: z
    .enum([
      BookingStatus.PENDING,
      BookingStatus.CONFIRMED,
      BookingStatus.CANCELLED,
      BookingStatus.COMPLETED,
    ])
    .optional()
    .default(BookingStatus.PENDING),
  totalPrice: z.number().positive("Total price must be a positive number").optional(),
});

export const validateBooking = (data: unknown) => {
  const result = bookingSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

// Login Validation
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const validateLogin = (data: unknown) => {
  const result = loginSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

// Update Role Validation
export const updateRoleSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  role: z.enum([Role.USER, Role.ADMIN, Role.COMPANY_ADMIN]),
});

export const validateUpdateRole = (data: unknown) => {
  const result = updateRoleSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

// Filter Validation
export const routeFilterSchema = z.object({
  origin: z.string().optional(),
  destination: z.string().optional(),
});

export const validateRouteFilter = (data: unknown) => {
  const result = routeFilterSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export const scheduleFilterSchema = z.object({
  routeId: z.string().uuid("Invalid route ID").optional(),
  busId: z.string().uuid("Invalid bus ID").optional(),
  departure: z.coerce.date().optional(),
  arrival: z.coerce.date().optional(),
});

export const validateScheduleFilter = (data: unknown) => {
  const result = scheduleFilterSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export const busFilterSchema = z.object({
  companyId: z.string().uuid("Invalid company ID").optional(),
  type: z.enum([BusType.STANDARD, BusType.DELUXE, BusType.LUXURY]).optional(),
});

export const validateBusFilter = (data: unknown) => {
  const result = busFilterSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};