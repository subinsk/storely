import axios from "axios";

export type OrganizationWithMeta = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  plan: string;
  membersCount: number;
};

export const getOrganizations = async (search?: string): Promise<OrganizationWithMeta[]> => {
  const params = search ? { search } : {};
  const { data } = await axios.get("/api/organizations", { params });
  return data.organizations;
};

export const getOrganizationById = async (id: string) => {
  const { data } = await axios.get(`/api/organizations/${id}`);
  return data.organization;
};

export const getOrganizationUsers = async (orgId: string, search?: string, filters?: any) => {
  const params = { ...(search ? { search } : {}), ...(filters || {}) };
  const { data } = await axios.get(`/api/organizations/${orgId}/users`, { params });
  return data.users;
};

export const createOrganization = async (payload: { name: string; plan: string }) => {
  const { data } = await axios.post("/api/organizations", payload);
  return data.organization;
};
