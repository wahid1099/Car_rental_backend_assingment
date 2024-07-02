import httpStatus from "http-status";
import AppError from "../../error/AppError";

import { TCar } from "./car.interface";
import { Car } from "./car.model";
import mongoose from "mongoose";
import { Booking } from "../Booking/booking.model";
import { start } from "repl";

const createCarIntoDB = async (payload: TCar): Promise<TCar> => {
  const car = await Car.create(payload);
  return car;
};

const getAllCarsFromDb = async () => {
  const result = await Car.find();
  return result;
};

const getSingleCarFromDb = async (id: string) => {
  const result = await Car.findById(id);
  return result;
};

const updateCarIntoDb = async (id: string, payload: Partial<TCar>) => {
  const updatedPayload = {
    ...payload,
    updatedAt: new Date(),
  };
  const result = await Car.findByIdAndUpdate({ _id: id }, updatedPayload, {
    new: true,
  });

  return result;
};

const deleteCarFromDb = async (id: string) => {
  const result = await Car.findByIdAndUpdate(
    { _id: id },
    { isDelete: true },
    {
      new: true,
    }
  );
  return result;
};

const returnCarIntoDb = async (bookingId: string, endTime: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, "Booking Not Found!!");
    }

    const car = await Car.findById(booking.car).session(session);
    if (!car) {
      throw new AppError(httpStatus.NOT_FOUND, "Car Not Found!!");
    }

    const startTime = booking.startTime;
    const pricePerHour = car.pricePerHour;

    // Converting time to date
    const start = new Date(`${booking.date}T${startTime}`);
    const end = new Date(`${booking.date}T${endTime}`);

    // Calculating hours of booking
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const totalCost = duration * pricePerHour;

    // Updating the car status to available
    await Car.findByIdAndUpdate(
      car._id,
      { status: "available" },
      { new: true, session }
    );

    // Updating the booking with endTime and totalCost
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { endTime, totalCost },
      { new: true, session }
    )
      .populate("car")
      .populate("user");

    await session.commitTransaction();
    await session.endSession();

    return updatedBooking;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const CarServices = {
  createCarIntoDB,
  getAllCarsFromDb,
  getSingleCarFromDb,
  updateCarIntoDb,
  deleteCarFromDb,
  returnCarIntoDb,
};
