import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string(),
  price: z.number().positive({ message: "Price must be positive number" }),
  tags: z.array(z.string()),
  stock: z
    .number()
    .int()
    .nonnegative({ message: "Stock must be a non-negative integer" }),
});
