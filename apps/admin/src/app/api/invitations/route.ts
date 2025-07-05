import { NextResponse } from "next/server";
import transporter from "@/lib/mailer";
import { getServerSession } from "next-auth";
import { ROLE_LABEL_MAP } from "@/constants/role-label-map";
import { authOptions } from "@/lib/auth";
import { prisma } from "@storely/database";

export async function POST(req: Request) {
  const { email, role, organizationId } = await req.json();
  
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const invitedById = session.user.id;
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48); // 48h expiry

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    // Check if invitation already exists
    const existingInvitation = await prisma.invitation.findFirst({
      where: { 
        email,
        organizationId,
        status: "pending"
      }
    });

    if (existingInvitation) {
      return NextResponse.json({ error: "Invitation already sent to this email" }, { status: 409 });
    }

    const invitation = await prisma.invitation.create({
      data: {
        email,
        role,
        organizationId,
        invitedById,
        status: "pending",
        expiresAt,
      },
      include: {
        organization: true,
        invitedBy: true,
      }
    });

    // Send email invitation
    const inviteLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/invite/${invitation.id}`;
    
    await transporter.sendMail({
      from: process.env.INVITE_EMAIL_FROM || process.env.SMTP_USER,
      to: email,
      subject: `You're invited to join ${invitation.organization.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>You're invited to join ${invitation.organization.name}</h2>
          <p>Hello,</p>
          <p>${invitation.invitedBy.name} has invited you to join ${invitation.organization.name} as a ${ROLE_LABEL_MAP[invitation.role] || invitation.role}.</p>
          <p>Click the link below to accept your invitation:</p>
          <a href="${inviteLink}" style="background-color: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Accept Invitation</a>
          <p>This invitation will expire in 48 hours.</p>
          <p>If you have any questions, please contact ${invitation.invitedBy.email}.</p>
        </div>
      `,
    });

    return NextResponse.json({ invitation });
  } catch (error: any) {
    console.error("Invitation error:", error);
    return NextResponse.json({ error: "Failed to send invitation" }, { status: 500 });
  }
}
