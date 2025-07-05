import { NextResponse } from "next/server";
import { prisma } from '@storely/database';
import { getServerSession } from "next-auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  try {
    const user = await prisma.user.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUserId = session.user.id;
  const userToDeleteId = params.id;

  // Prevent self-deletion
  if (currentUserId === userToDeleteId) {
    return NextResponse.json({ error: "You cannot delete yourself" }, { status: 400 });
  }

  try {
    // Check if user exists and get their role for permission check
    const userToDelete = await prisma.user.findUnique({
      where: { id: userToDeleteId },
      select: { id: true, role: true, organizationId: true },
    });

    if (!userToDelete) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get current user's role and org
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { role: true, organizationId: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "Current user not found" }, { status: 404 });
    }

    // Role level check (same as frontend)
    const roleLevels = { super_admin: 100, org_admin: 80, org_user: 50, member: 10 };
    const currentUserLevel = roleLevels[currentUser.role as keyof typeof roleLevels] ?? 0;
    const targetUserLevel = roleLevels[userToDelete.role as keyof typeof roleLevels] ?? 0;

    if (currentUserLevel < targetUserLevel) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    // For org_admin, can only delete users in same organization
    if (currentUser.role === "org_admin" && currentUser.organizationId !== userToDelete.organizationId) {
      return NextResponse.json({ error: "Can only delete users in your organization" }, { status: 403 });
    }

    await prisma.user.delete({ where: { id: userToDeleteId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
