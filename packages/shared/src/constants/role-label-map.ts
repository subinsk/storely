// src/constants/role-label-map.ts
export const ROLE_LABEL_MAP: Record<string, string> = {
  super_admin: "Super Admin",
  org_admin: "Org Admin",
  org_user: "Org User",
  member: "Member",
};

export const ROLE_LEVEL_MAP: Record<string, number> = {
  super_admin: 100,
  org_admin: 80,
  org_user: 50,
  member: 10,
};
