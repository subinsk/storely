import { prisma } from "@storely/database";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const { id, ...data } = await req.json();
  try {
    const invitation = await prisma.invitation.update({
      where: { id },
      data,
    });
    return NextResponse.json({ invitation });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update invitation" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  try {
    await prisma.invitation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete invitation" }, { status: 500 });
  }
}
