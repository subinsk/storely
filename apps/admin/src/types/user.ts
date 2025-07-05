export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  organizationId?: string;
  role?: string;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}
