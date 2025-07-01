import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-client";

// GET invitation details by ID (for validation and display)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { id: params.id },
      include: {
        organization: true,
        invitedBy: {
          select: { name: true, email: true }
        }
      }
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    // Check if invitation is expired
    if (new Date() > invitation.expiresAt) {
      return NextResponse.json({ error: "Invitation has expired" }, { status: 410 });
    }

    // Check if invitation is already accepted
    if (invitation.status === "accepted") {
      return NextResponse.json({ error: "Invitation has already been accepted" }, { status: 409 });
    }

    // Check if invitation is revoked
    if (invitation.status === "revoked") {
      return NextResponse.json({ error: "Invitation has been revoked" }, { status: 403 });
    }

    return NextResponse.json({ invitation });
  } catch (error) {
    console.error("Get invitation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST accept invitation and create user account
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name, password } = await req.json();

    if (!name || !password) {
      return NextResponse.json({ error: "Name and password are required" }, { status: 400 });
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id: params.id },
      include: {
        organization: true
      }
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    // Check if invitation is expired
    if (new Date() > invitation.expiresAt) {
      return NextResponse.json({ error: "Invitation has expired" }, { status: 410 });
    }

    // Check if invitation is already accepted
    if (invitation.status === "accepted") {
      return NextResponse.json({ error: "Invitation has already been accepted" }, { status: 409 });
    }

    // Check if invitation is revoked
    if (invitation.status === "revoked") {
      return NextResponse.json({ error: "Invitation has been revoked" }, { status: 403 });
    }

    // Check if user already exists with this email
    const existingUser = await prisma.user.findUnique({
      where: { email: invitation.email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    // Hash password
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user and update invitation in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: invitation.email,
          name,
          password: hashedPassword,
          role: invitation.role, // Use role from invitation
          organizationId: invitation.organizationId,
        }
      });

      // Update invitation status
      await tx.invitation.update({
        where: { id: invitation.id },
        data: {
          status: "accepted",
          acceptedAt: new Date(),
        }
      });

      return user;
    });

    return NextResponse.json({ 
      message: "Invitation accepted successfully",
      user: {
        id: result.id,
        email: result.email,
        name: result.name,
        role: result.role,
        organizationId: result.organizationId
      }
    });
  } catch (error) {
    console.error("Accept invitation error:", error);
    return NextResponse.json({ error: "Failed to accept invitation" }, { status: 500 });
  }
}
