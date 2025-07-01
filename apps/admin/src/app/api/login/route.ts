import { prisma } from "@/lib";
import { User } from "@prisma/client";
import { compare } from "bcryptjs";

async function getUser(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch (error) {
    throw new Error("Failed to fetch user.");
  }
}

export async function POST(request: Request) {
  try {
    const res = await request.json();

    const { email, password } = res;
    const user = await getUser(email);

    if (!user)
      return Response.json({
        success: false,
        data: null,
        message: "Invalid credentials",
      });

    const passwordsMatch = user.password
      ? await compare(password, user.password)
      : false;

    if (passwordsMatch) return Response.json({ success: true, data: user });

    return Response.json({
      success: false,
      data: null,
      message: "Invalid credentials",
    });
  } catch (e: any) {
    return Response.json({
      success: false,
      data: null,
      message: e.message,
    });
  }
}
