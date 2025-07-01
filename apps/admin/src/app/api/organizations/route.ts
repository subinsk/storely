import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || undefined;
  try {
    const organizations = await prisma.organization.findMany({
      where: search
        ? { name: { contains: search, mode: "insensitive" } }
        : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        users: true,
      },
    });
    // Map to include members count and plan
    const orgsWithMeta = organizations.map(org => ({
      id: org.id,
      name: org.name,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
      plan: org.plan,
      membersCount: org.users.length,
    }));
    return NextResponse.json({ organizations: orgsWithMeta });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch organizations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { name, plan } = await req.json();
  
  if (!name?.trim()) {
    return NextResponse.json({ error: "Organization name is required" }, { status: 400 });
  }

  try {
    const organization = await prisma.organization.create({
      data: {
        name: name.trim(),
        plan: plan || "free",
      },
    });
    return NextResponse.json({ organization });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Organization name already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
