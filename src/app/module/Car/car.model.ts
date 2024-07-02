import { model, Schema } from "mongoose";
import { TCar } from "./car.interface";

const carSchema = new Schema<TCar>({
  name: { type: String, required: [true, "Car name must be required"] },
  description: {
    type: String,
    required: [true, "Car description must be required"],
  },
  color: { type: String, required: [true, "Car color must be required"] },
  isElectric: { type: Boolean, required: [true, "isElectric Is required"] },
  features: { type: [String], required: [true, "Features is required"] },
  isDelete: { type: Boolean, default: false },
  pricePerHour: { type: Number, required: [true, "PricePerhour is required"] },
  status: { type: String, default: "available" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Car = model<TCar>("Car", carSchema);
