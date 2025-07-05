import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@storely/database";

export function CustomPrismaAdapter(prismaClient: typeof prisma) {
  const baseAdapter = PrismaAdapter(prismaClient);

  return {
    ...baseAdapter,
    async getUser(id: string) {
      const user = await prismaClient.user.findUnique({ where: { id } });
      if (!user) return null;
      return {
        ...user,
        role: user.role,
        organizationId: user.organizationId,
      };
    },
    async getUserByEmail(email: string) {
      const user = await prismaClient.user.findUnique({ where: { email } });
      if (!user) return null;
      return {
        ...user,
        role: user.role,
        organizationId: user.organizationId,
      };
    },
    // ...existing code...
  };
}
