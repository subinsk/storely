import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-client";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: params.id },
    });
    if (!organization) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ organization });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch organization" }, { status: 500 });
  }
}
