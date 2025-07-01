import { imagekit } from "@/lib";

export async function GET(req: Request) {
  const result = imagekit.getAuthenticationParameters();

  return Response.json(result);
}
