import axios from "axios";

export const getOrganizationById = async (id: string) => {
  const { data } = await axios.get(`/api/organizations/${id}`);
  return data.organization;
};

export const getOrganizationUsers = async (orgId: string, search?: string, filters?: any) => {
  const params = { ...(search ? { search } : {}), ...(filters || {}) };
  const { data } = await axios.get(`/api/organizations/${orgId}/users`, { params });
  return data.users;
};

export const inviteUser = async (payload: any) => {
  const { data } = await axios.post(`/api/invitations`, payload);
  return data;
};

export const updateUser = async (id: string, payload: any) => {
  const { data } = await axios.patch(`/api/users/${id}`, payload);
  return data;
};

export const deleteUser = async (id: string) => {
  const { data } = await axios.delete(`/api/users/${id}`);
  return data;
};

export const resendInvitation = async (invitationId: string) => {
  const { data } = await axios.post("/api/invitations/resend", { invitationId });
  return data;
};
