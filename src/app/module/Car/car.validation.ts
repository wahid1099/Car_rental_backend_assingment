import { z } from "zod";

const carSchemaValidation = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Car name must be required" }),
    description: z
      .string()
      .min(1, { message: "car description must be required" }),
    color: z.string().min(1, { message: "Car color is required" }),
    isElectric: z
      .boolean()
      .refine((val) => val !== undefined, "Electric status is required"),
    features: z.array(z.string()).nonempty("At least one feature is required"),
    pricePerHour: z.number().min(0, "Price per hour must be a positive number"),
    carImgUrl: z
      .string()
      .url("Must be a valid URL")
      .nonempty("At least one image URL is required"),
    vehicleSpecification: z
      .array(z.string())
      .nonempty("At least one vehicle specification is required"),
    maxSeats: z.number().int().positive("Max seats must be a positive integer"),
    rating: z.number().min(0).max(5, "Rating must be between 0 and 5"),
    gearType: z.string().min(1, "Gear type is required"),
    fuelType: z.string().min(1, "Fuel type is required"),
    carType: z.string().min(1, "Car type is required"),
  }),
});

const updateCarSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, { message: "Car Name must be required" })
      .optional(),
    description: z
      .string()
      .min(1, { message: "Car Description must be required" })
      .optional(),
    color: z.string().min(1, { message: "Car color is required" }).optional(),
    isElectric: z
      .boolean()
      .refine((val) => val !== undefined, "isElectric is required")
      .optional(),
    features: z
      .array(z.string())
      .nonempty("Features must be a non-empty array")
      .optional(),
    isDelete: z.boolean().default(false).optional(),

    pricePerHour: z.number().optional(),

    carImgUrl: z.string().optional(),
    vehicleSpecification: z.array(z.string()).optional(),
    maxSeats: z.number().optional(),
    rating: z.number().optional(),
    gearType: z.string().optional(),
    fuelType: z.string().optional(),
    carType: z.string().optional(),
  }),
});

// Usage:
export const CarValidation = {
  carSchemaValidation,
  updateCarSchema,
};
