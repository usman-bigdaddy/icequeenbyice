import * as z from "zod";

export const Sign_In_Schema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(4, { message: "password must be atleast 4 characters" }),
});

export const Create_User_Schema = z.object({
  email: z.string().email(),
  fullName: z.string(),
});

export const Product_Schema = z.object({
  name: z.string().max(255, "Name must be at most 255 characters long."),
  description: z.string().nullable().optional(),
  fabricType: z
    .string()
    .max(100, "Fabric type must be at most 100 characters long."),
  size: z.string(),
  width: z.coerce.number().nonnegative("Width must be a positive number."),
  length: z.string().optional(),
  price: z.coerce.number().nonnegative("Price must be a positive number."),
  quantity: z.coerce
    .number()
    .nonnegative("Quantity must be a non-negative number."),
  // image: z.string().url("Image must be a valid URL.").optional(),
  featured: z.boolean(),
  bestSeller: z.boolean(),
  trending: z.boolean(),
});

export const Change_Password_Schema = z.object({
  password: z
    .string()
    .min(4, { message: "password must be atleast 6 characters" }),
  password2: z
    .string()
    .min(4, { message: "password must be atleast 6 characters" }),
});
