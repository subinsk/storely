import { categorySchema } from "@/schema/category";

export const validateApiRequest = async (request: Request) => {
  const res = await request.json();

  const response = categorySchema.safeParse(res);

  if (!response.success) {
    const { errors } = response.error;

    return Response.json(
      {
        error: { message: "Invalid request", errors },
        success: false,
      },
      {
        status: 400,
      }
    );
  }

  return response.data;
};
