import { z, ZodType, ZodTypeDef } from "zod";

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const categorySchema: ZodType<ZodTypeDef> = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Category description is required"),
  image: z.any().optional(),
  parent: z.string().optional(),
});
