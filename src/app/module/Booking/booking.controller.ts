import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingServices } from "./booking.service";

const createBooking = catchAsync(async (req, res) => {
  const newBooking = await BookingServices.BookingcarFromDB(req.body, req.user);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Car booked successfully",
    data: newBooking,
  });
});

const getAllBookings = catchAsync(async (req, res) => {
  const query = req.query;
  const bookings = await BookingServices.getAllBookingsFromDB(query);

  bookings.length < 1
    ? sendResponse(res, {
        success: true,
        statusCode: httpStatus.NOT_FOUND,
        message: "No bookings found",
        data: null,
      })
    : sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Bookings retrieved successfully",
        data: bookings,
      });
});

const getMyBookings = catchAsync(async (req, res) => {
  const useremail = req.user?.userEmail;

  const result = await BookingServices.getMyBookingsFromDB(useremail);

  result.length < 1
    ? sendResponse(res, {
        success: true,
        statusCode: httpStatus.NOT_FOUND,
        message: "No Data found",
        data: req,
      })
    : sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "My bookings retrieved successfully",
        data: result,
      });
});

export const BookingControllers = {
  createBooking,
  getAllBookings,
  getMyBookings,
};
