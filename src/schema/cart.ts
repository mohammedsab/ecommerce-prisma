import { z } from "zod";

export const CartSchema = z.object({
  userId: z.string(),
});

export const CartItemSchema = z.object({
  quantity: z.number().int().positive(),
  productId: z.string(),
  cartId: z.string().optional(),
});
