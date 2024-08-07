import httpStatus from "http-status";

import AppError from "../../error/AppError";
import { Car } from "../Car/car.model";
import { Booking } from "./booking.model";
import { User } from "../User/user.model";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

const BookingcarFromDB = async (
  payload: Record<string, unknown>,
  userdata: JwtPayload
) => {
  const userInformation = await User.findOne({ email: userdata.userEmail });

  if (!userInformation) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found!!");
  }
  payload.car = payload.carId;

  const carData = await Car.findById(payload.carId);

  if (!carData) {
    throw new AppError(httpStatus.NOT_FOUND, "Car Not found!!");
  }

  if (carData.status !== "available") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Car booking is not available!!"
    );
  }

  payload.user = userInformation._id;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    carData.status = "unavailable";
    await Car.create([carData], { session });
    const bookingData = await Booking.create([payload], { session });
    const result = bookingData[0];
    await (await result.populate("user")).populate("car");

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const getAllBookingsFromDB = async (query: Record<string, unknown>) => {
  const { carId, date } = query;
  const filter: any = {};
  if (carId) {
    filter.car = carId;
  }
  if (date) {
    filter.date = date;
  }

  const result = await Booking.find(filter).populate("car").populate("user");
  return result;
};

const getMyBookingsFromDB = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user?._id) {
    throw new AppError(httpStatus.NOT_FOUND, "User not Found!!");
  }

  const bookings = await Booking.find({ user: user?._id })
    .populate("user")
    .populate("car");
  return bookings;
};

export const BookingServices = {
  BookingcarFromDB,
  getAllBookingsFromDB,
  getMyBookingsFromDB,
};
