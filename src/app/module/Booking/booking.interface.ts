import { Types } from "mongoose";

// Define the interface for the Booking model

export type TBooking = {
  user: Types.ObjectId;
  car: Types.ObjectId;
  pickUpDate: string;
  pickTime: string;
  dropOffDate: string;
  dropTime: string;
  totalCost: number;
  transactionId: string;
  status: "pending" | "ongoing" | "completed" | "cancelled";
  identity: string;
  paymentStatus: "pending" | "paid" | "failed";
  identityNo: string;
  drivingLicenseNo: string;
  isDeleted: boolean;
};
