import { authorizedAPI } from "@/lib/api";
import handleApiRequest from "@/utils/handleApiRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ISchedule } from "../types";

const createSchedule = (scheduleData: ISchedule): Promise<any> => {
  return handleApiRequest(() => authorizedAPI.post("/schedule", scheduleData));
};

const getSchedules = (filters: {
  routeId?: string;
  busId?: string;
  departure?: string;
  arrival?: string;
}): Promise<any> => {
  const params = new URLSearchParams();
  if (filters.routeId) params.append("routeId", filters.routeId);
  if (filters.busId) params.append("busId", filters.busId);
  if (filters.departure) params.append("departure", filters.departure);
  if (filters.arrival) params.append("arrival", filters.arrival);

  return handleApiRequest(() =>
    authorizedAPI.get(`/schedule${params.toString() ? `?${params}` : ""}`)
  );
};

const getSchedule = (scheduleId: string): Promise<any> => {
  return handleApiRequest(() => authorizedAPI.get(`/schedule/${scheduleId}`));
};

const updateSchedule = ({
  scheduleId,
  updateData,
}: {
  scheduleId: string;
  updateData: Partial<ISchedule>;
}): Promise<any> => {
  return handleApiRequest(() =>
    authorizedAPI.patch(`/schedule/${scheduleId}`, updateData)
  );
};

const deleteSchedule = (scheduleId: string): Promise<any> => {
  return handleApiRequest(() => authorizedAPI.delete(`/schedule/${scheduleId}`));
};

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
};

export const useGetSchedules = (filters: {
  routeId?: string;
  busId?: string;
  departure?: string;
  arrival?: string;
}) => {
  return useQuery({
    queryKey: ["schedules", filters],
    queryFn: () => getSchedules(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

export const useGetSchedule = (scheduleId: string) => {
  return useQuery({
    queryKey: ["schedule", scheduleId],
    queryFn: () => getSchedule(scheduleId),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    enabled: !!scheduleId, // Only run query if scheduleId is provided
  });
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
};