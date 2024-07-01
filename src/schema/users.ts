import { z } from "zod";

export const SignUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string().optional(),
  postelCode: z.string().optional(),
  country: z.string(),
  type: z
    .enum(["HOME", "WORK", "COMPANY", "HOSPITAL", "FACTORY", "OTHER"])
    .default("HOME"), // Default value for AddressType
  notes: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  defaultShippingAddress: z.string().optional(),
  defaultBillingAddress: z.string().optional(),
});
