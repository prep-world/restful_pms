import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/* ==================== API CALLS ==================== */
const createBooking = (bookingData: any): Promise<any> => {
  return handleApiRequest(() => authorizedAPI.post("/bookings", bookingData));
};

const getUserBookings = (): Promise<any> => {
  return handleApiRequest(() => authorizedAPI.get("/bookings"));
};

const getBookingById = (bookingId: string): Promise<any> => {
  return handleApiRequest(() => authorizedAPI.get(`/bookings/${bookingId}`));
};

const cancelBooking = (bookingId: string): Promise<any> => {
  return handleApiRequest(() => authorizedAPI.patch(`/bookings/${bookingId}/cancel`));
};

const completeBooking = (bookingId: string): Promise<any> => {
  return handleApiRequest(() => authorizedAPI.patch(`/bookings/${bookingId}/complete`));
};

/* ==================== REACT QUERY HOOKS ==================== */

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userBookings"] });
    },
  });
};

export const useUserBookings = () => {
  return useQuery({
    queryKey: ["userBookings"],
    queryFn: getUserBookings,
  });
};

export const useBooking = (bookingId: string) => {
  return useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBookingById(bookingId),
    enabled: !!bookingId,
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userBookings"] });
    },
  });
};

export const useCompleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userBookings"] });
    },
  });
};
