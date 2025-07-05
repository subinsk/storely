import { NextResponse } from "next/server";
import transporter from "@/lib/mailer";
import { prisma } from "@storely/database";

export async function POST(req: Request) {
  const { invitationId } = await req.json();

  try {
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      include: {
        organization: true,
        invitedBy: true,
      }
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    if (invitation.status !== "pending") {
      return NextResponse.json({ error: "Invitation is no longer pending" }, { status: 400 });
    }

    // Update expiry date
    const newExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48); // 48h from now
    await prisma.invitation.update({
      where: { id: invitationId },
      data: { 
        expiresAt: newExpiresAt,
        updatedAt: new Date()
      }
    });

    // Resend email
    const inviteLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/invite/${invitation.id}`;
    
    await transporter.sendMail({
      from: process.env.INVITE_EMAIL_FROM || process.env.SMTP_USER,
      to: invitation.email,
      subject: `Reminder: You're invited to join ${invitation.organization.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reminder: You're invited to join ${invitation.organization.name}</h2>
          <p>Hello,</p>
          <p>This is a reminder that ${invitation.invitedBy.name} has invited you to join ${invitation.organization.name}.</p>
          <p>Click the link below to accept your invitation:</p>
          <a href="${inviteLink}" style="background-color: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Accept Invitation</a>
          <p>This invitation will expire in 48 hours.</p>
          <p>If you have any questions, please contact ${invitation.invitedBy.email}.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend invitation error:", error);
    return NextResponse.json({ error: "Failed to resend invitation" }, { status: 500 });
  }
}
