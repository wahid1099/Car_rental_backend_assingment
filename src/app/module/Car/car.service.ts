import httpStatus from "http-status";
import AppError from "../../error/AppError";
import moment from "moment";

import { TCar, TSearchCriteria } from "./car.interface";
import { Car } from "./car.model";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../User/user.model";
import mongoose from "mongoose";
import { Booking } from "../Booking/booking.model";
import { start } from "repl";
import { calculateTotalPrice } from "./car.utils";

//creating new car
const createCarIntoDB = async (payload: TCar): Promise<TCar> => {
  const car = await Car.create(payload);
  return car;
};

//getting all cars
const getAllCarsFromDb = async (
  name: string,
  carType: string,
  location: string,
  price: number
) => {
  let query: any = {
    isDelete: { $ne: true },
  };
  if (name) {
    const searchRegex = new RegExp(name, "i");
    query = {
      $or: [{ name: searchRegex }],
    };
  }
  if (carType) {
    const searchRegex = new RegExp(carType, "i");
    query = {
      $or: [{ carType: searchRegex }],
    };
  }

  if (location) {
    const searchRegex = new RegExp(location, "i");
    query = {
      $or: [{ location: searchRegex }],
    };
  }
  if (price > 0) {
    query.pricePerHour = { $lte: price };
  }

  const result = await Car.find(query);
  return result;
};

//getting single car

const getSingleCarFromDb = async (id: string) => {
  const result = await Car.findById(id);
  return result;
};

//updating car data

const updateCarIntoDb = async (id: string, payload: Partial<TCar>) => {
  const { vehicleSpecification, features, ...reemainingPayload } = payload;
  const modifideUpdateData: Record<string, unknown> = {
    ...reemainingPayload,
  };

  // for features
  if (features && Object.keys(features).length) {
    for (const [key, value] of Object.entries(features)) {
      modifideUpdateData[`features.${key}`] = value;
    }
  }
  // for vehicleSpecification
  if (vehicleSpecification && Object.keys(vehicleSpecification).length) {
    for (const [key, value] of Object.entries(vehicleSpecification)) {
      modifideUpdateData[`vehicleSpecification.${key}`] = value;
    }
  }
  const result = await Car.findOneAndUpdate({ _id: id }, modifideUpdateData, {
    new: true,
    runValidators: true,
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

const returnCarIntoDb = async (bookingId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, "Booking Not Found!!");
    }

    const car = await Car.findById(booking.car).session(session);
    if (!car) {
      throw new AppError(httpStatus.NOT_FOUND, "Car Not Found!!");
    }

    // Get the current date and time
    const currentDate = new Date();
    const dropOffDate = moment(currentDate).format("DD-MM-YYYY"); // Format as required (DD-MM-YYYY)
    const dropTime = moment(currentDate).format("HH:mm"); // Format time as 24-hour (HH:mm)

    const { pickUpDate, pickTime } = booking;
    const pricePerHour = car.pricePerHour;

    const { totalCost } = calculateTotalPrice(
      pickUpDate,
      pickTime,
      pricePerHour
    );

    // Update booking with total cost, dropOffDate, and dropTime
    booking.totalCost = totalCost;
    booking.dropOffDate = dropOffDate;
    booking.dropTime = dropTime;
    booking.status = "completed";

    await booking.save({ session });

    // Update car status to available
    car.status = "available";
    await car.save({ session });

    // Re-query the booking to populate the car and user fields
    const populatedBooking = await Booking.findById(bookingId)
      .populate("car")
      .populate("user")
      .session(session);

    await session.commitTransaction();
    session.endSession();

    return populatedBooking;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

// searching a  car from database
const searchCarsFromDB = async ({
  features,
  carType,
  seats,
}: TSearchCriteria) => {
  const query: any = { status: "available" };

  if (carType) {
    query.carType = carType;
  }
  if (seats) {
    query.maxSeats = seats;
  }
  if (features) {
    query.features = { $in: [features] };
  }

  const result = await Car.find(query);

  return result;
};

export const CarServices = {
  createCarIntoDB,
  getAllCarsFromDb,
  getSingleCarFromDb,
  updateCarIntoDb,
  deleteCarFromDb,
  returnCarIntoDb,
  searchCarsFromDB,
};
