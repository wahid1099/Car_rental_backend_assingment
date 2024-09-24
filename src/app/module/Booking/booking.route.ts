import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { BookingValidation } from "./booking.validation";
import { BookingControllers } from "./booking.controller";
import Auth from "../../middleware/auth";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

// Specific user routes should come before general ones.
router.get(
  "/my-bookings",
  Auth(USER_ROLE.user),
  BookingControllers.getMyBookings
);

// Booking creation route
router.post(
  "/",
  Auth(USER_ROLE.user),
  validateRequest(BookingValidation.BookingValidationSchema),
  BookingControllers.createBooking
);

// Booking completion route
router.post(
  "/complete-booking/:bookingId",
  Auth(USER_ROLE.user),
  BookingControllers.completeBookingFromDB
);

// Update booking route
router.patch(
  "/update-booking/:bookingId",
  Auth(USER_ROLE.user),
  BookingControllers.updateBooking
);

// Update booking status route (Admin)
router.patch(
  "/update-booking-status/:bookingId",
  Auth(USER_ROLE.admin),
  BookingControllers.updateBookingStatusFromDB
);

// Delete booking route
router.delete(
  "/delete-booking/:bookingId",
  Auth(USER_ROLE.user, USER_ROLE.admin),
  BookingControllers.deletedBooking
);

// Get all bookings (Admin)
router.get("/", Auth(USER_ROLE.admin), BookingControllers.getAllBookings);

export const BookingRoutes = router;
