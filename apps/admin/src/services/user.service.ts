import {api} from "@storely/shared/lib/axios";
import { useQuery } from '@tanstack/react-query';
import { User } from '@/types/user';

export const useGetUser = () => {
  return useQuery<User>({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await api.get('/api/auth/session');
      return data.user;
    },
  });
};

export const getOrganizationById = async (id: string) => {
  const { data } = await api.get(`/api/organizations/${id}`);
  return data.organization;
};

export const getOrganizationUsers = async (orgId: string, search?: string, filters?: any) => {
  const params = { ...(search ? { search } : {}), ...(filters || {}) };
  const { data } = await api.get(`/api/organizations/${orgId}/users`, { params });
  return data.users;
};

export const inviteUser = async (payload: any) => {
  const { data } = await api.post(`/api/invitations`, payload);
  return data;
};

export const updateUser = async (id: string, payload: any) => {
  const { data } = await api.patch(`/api/users/${id}`, payload);
  return data;
};

export const getUserById = async (id: string) => {  
  const { data } = await api.get(`/api/users/${id}`);
  return data.user;
}

export const deleteUser = async (id: string) => {
  const { data } = await api.delete(`/api/users/${id}`);
  return data;
};

export const resendInvitation = async (invitationId: string) => {
  const { data } = await api.post("/api/invitations/resend", { invitationId });
  return data;
};
