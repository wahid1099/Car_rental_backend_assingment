import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { CarServices } from "./car.service";

const createCar = catchAsync(async (req, res) => {
  const result = await CarServices.createCarIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Car created succesfully",
    data: result,
  });
});

const getAllCars = catchAsync(async (req, res) => {
  const result = await CarServices.getAllCarsFromDb();

  result.length < 1
    ? sendResponse(res, {
        success: true,
        statusCode: httpStatus.NOT_FOUND,
        message: "Data Not Found!",
        data: result,
      })
    : sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Cars retrieved successfully",
        data: result,
      });
});

const getSingleCar = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CarServices.getSingleCarFromDb(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "A Car retrieved successfully",
    data: result,
  });
});

const updateCar = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CarServices.updateCarIntoDb(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Car updated successfully",
    data: result,
  });
});

const delteCar = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CarServices.deleteCarFromDb(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Car Deleted successfully",
    data: result,
  });
});

const returnCar = catchAsync(async (req, res) => {
  const { bookingId, endTime } = req.body;
  console.log("hi");
  console.log(bookingId);
  console.log(endTime);

  const result = await CarServices.returnCarIntoDb(bookingId, endTime);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Car returned Successfully!!",
    data: result,
  });
});

export const CarControllers = {
  createCar,
  getAllCars,
  getSingleCar,
  updateCar,
  delteCar,
  returnCar,
};
