import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-client";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || undefined;
  try {
    // Get users and invitations for the org
    const users = await prisma.user.findMany({
      where: {
        organizationId: params.id,
        ...(search ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ]
        } : {})
      },
      orderBy: { createdAt: "desc" },
    });
    const invitations = await prisma.invitation.findMany({
      where: { organizationId: params.id },
      orderBy: { createdAt: "desc" },
    });
    // Mark invited users with status 'invited'
    const invitedUsers = invitations.map(invite => ({
      id: invite.id,
      name: '',
      email: invite.email,
      role: '',
      status: 'invited',
    }));
    const allUsers = [
      ...users,
      ...invitedUsers
    ];
    return NextResponse.json({ users: allUsers });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
