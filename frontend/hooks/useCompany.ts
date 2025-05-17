import { authorizedAPI } from "@/lib/api";
import { ICompany } from "@/types";
import handleApiRequest from "@/utils/handleApiRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


const createCompany = (companyData: ICompany): Promise<any> => {
  return handleApiRequest(() => authorizedAPI.post("/company", companyData));
};

const getCompanies = (): Promise<any> => {
  return handleApiRequest(() => authorizedAPI.get("/company"));
};

const getCompany = (companyId: string): Promise<any> => {
  return handleApiRequest(() => authorizedAPI.get(`/company/${companyId}`));
};

const updateCompany = ({ companyId, updateData }: { companyId: string; updateData: Partial<ICompany> }): Promise<any> => {
  return handleApiRequest(() => authorizedAPI.patch(`/company/${companyId}`, updateData));
};

const deleteCompany = (companyId: string): Promise<any> => {
  return handleApiRequest(() => authorizedAPI.delete(`/company/${companyId}`));
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};

export const useGetCompanies = () => {
  return useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

export const useGetCompany = (companyId: string) => {
  return useQuery({
    queryKey: ["company", companyId],
    queryFn: () => getCompany(companyId),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    enabled: !!companyId, // Only run query if companyId is provided
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};