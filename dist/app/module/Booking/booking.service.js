"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const car_model_1 = require("../Car/car.model");
const booking_model_1 = require("./booking.model");
const user_model_1 = require("../User/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
// import { paymentGatway } from "../../utils/PaymentGatway";
const SSLCommerzPayment = require("sslcommerz").SslCommerzPayment;
const config_1 = __importDefault(require("../../config"));
const BookingCarFromDB = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield user_model_1.User.findOne({ email: user.userEmail });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, " User not found!!");
    }
    payload.car = payload.carId;
    payload.user = userData._id;
    // console.log(payload?.carId);
    const carData = yield car_model_1.Car.findById(payload === null || payload === void 0 ? void 0 : payload.carId);
    // console.log(carData);
    // check if the car is exists
    if (!carData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Car not found!!");
    }
    if (carData.status !== "available") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Car booking is not available");
    }
    payload.user = userData._id;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        carData.status = "unavailable";
        yield car_model_1.Car.create([carData], { session });
        // Save the booking to the database
        const bookingData = yield booking_model_1.Booking.create([payload], { session });
        const result = bookingData[0];
        yield (yield result.populate("user")).populate("car");
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(error);
    }
});
const getAllBookingsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { carId, date } = query;
    const filter = {};
    if (carId) {
        filter.car = carId;
    }
    if (date) {
        filter.date = date;
    }
    // console.log(filter);
    const result = yield booking_model_1.Booking.find(filter).populate("car").populate("user");
    // console.log(result);
    return result;
});
const getMyBookingsFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!(user === null || user === void 0 ? void 0 : user._id)) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const bookings = yield booking_model_1.Booking.find({ user: user === null || user === void 0 ? void 0 : user._id })
        .populate("user")
        .populate("car");
    return bookings;
});
const getsingleBookingsFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const bookings = yield booking_model_1.Booking.find({ _id: id })
        .populate("user")
        .populate("car");
    return bookings;
});
const updateBookeingFromDB = (user, payload, bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    // check the user is exists or not
    const userData = yield user_model_1.User.findOne({ email: user === null || user === void 0 ? void 0 : user.userEmail });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    //  check the booking using booking id and user id
    const isCarBooked = yield booking_model_1.Booking.findOne({
        user: userData === null || userData === void 0 ? void 0 : userData._id,
        _id: bookingId,
    });
    if (!isCarBooked) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Booking not found!");
    }
    // if status is pending, user can update data
    if (isCarBooked.status === "pending") {
        const updateBooking = yield booking_model_1.Booking.findOneAndUpdate({ _id: bookingId }, payload, { new: true });
        if (!updateBooking) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Bad request");
        }
        return updateBooking;
    }
    else {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Bad request");
    }
});
const deleteBookingFromDB = (user, bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // If admin, no need to check user existence
        const isCarBooked = yield booking_model_1.Booking.findById(bookingId).session(session);
        if (!isCarBooked) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking not found!");
        }
        // Check the booking status before deletion
        if (isCarBooked.status === "ongoing") {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You can't delete the booking because it is ongoing.");
        }
        // Only allow deletion if the booking status is pending or completed
        if (isCarBooked.status === "pending" ||
            isCarBooked.status === "completed") {
            const deleteBooking = yield booking_model_1.Booking.findOneAndUpdate({ _id: bookingId }, { isDeleted: true }, { new: true, session });
            // Update the car's isBooked status to false
            yield car_model_1.Car.findByIdAndUpdate(isCarBooked.car, { status: "available" }, { new: true, session });
            yield session.commitTransaction();
            return {
                success: true,
                message: "Booking deleted successfully!",
                booking: deleteBooking,
            };
        }
        else {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Booking cannot be deleted unless it is pending or completed.");
        }
    }
    catch (err) {
        yield session.abortTransaction();
        console.error("Error during booking deletion:", err);
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to delete booking!");
    }
    finally {
        yield session.endSession(); // Ensure session is closed
    }
});
const updateBookingStatus = (user, bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield user_model_1.User.findOne({ email: user.userEmail });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // check if the booking is exists
    const isBookingExists = yield booking_model_1.Booking.findOne({
        _id: bookingId,
    });
    if (!isBookingExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking not found");
    }
    // if booking is status pending then only user can update the booking
    const updateBooking = yield booking_model_1.Booking.findOneAndUpdate({ _id: bookingId }, { status: "ongoing" }, { new: true });
    return updateBooking;
});
const completedBooking = (user, bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    // check the user is exists or not
    const userData = yield user_model_1.User.findOne({ email: user === null || user === void 0 ? void 0 : user.userEmail });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // check the booking using booking id and user id
    const isCarBooked = yield booking_model_1.Booking.findById(bookingId);
    if (!isCarBooked) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Booking not found!");
    }
    // car is exists or not
    const carData = yield car_model_1.Car.findById(isCarBooked.car);
    if (!carData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Car not found!!");
    }
    const transactionId = (0, uuid_1.v4)();
    // handle payment
    const paymentDetails = {
        total_amount: isCarBooked === null || isCarBooked === void 0 ? void 0 : isCarBooked.totalCost,
        currency: "BDT",
        tran_id: transactionId,
        success_url: `https://car-rental-backend-assingment.vercel.app/api/payments/confirmations?bookingId=${bookingId}&transactionId=${transactionId}&status=successs`,
        fail_url: `https://car-rental-backend-assingment.vercel.app/api/payments/confirmations?status=failed`,
        cancel_url: "https://car-rental-bd-frontend-c8rk.vercel.app",
        // ipn_url: `${config.backend_url}/api/v1/payments/ipn`,
        shipping_method: "No",
        product_name: "Car Rental",
        product_category: "Service",
        product_profile: "non-physical-goods",
        cus_name: userData === null || userData === void 0 ? void 0 : userData.name,
        cus_email: userData === null || userData === void 0 ? void 0 : userData.email,
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: userData === null || userData === void 0 ? void 0 : userData.phone,
        cus_fax: userData === null || userData === void 0 ? void 0 : userData.phone,
        ship_name: userData === null || userData === void 0 ? void 0 : userData.name,
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: "1000",
        ship_country: "Bangladesh",
    };
    const sslcz = new SSLCommerzPayment(config_1.default.store_id, config_1.default.store_password, false);
    const apiResponse = yield sslcz.init(paymentDetails);
    // Assuming the API response contains a URL to redirect to
    if (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.GatewayPageURL) {
        return { paymentUrl: apiResponse.GatewayPageURL };
    }
    else {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to initialize payment!");
    }
});
exports.BookingServices = {
    BookingCarFromDB,
    getAllBookingsFromDB,
    getMyBookingsFromDB,
    updateBookeingFromDB,
    deleteBookingFromDB,
    updateBookingStatus,
    completedBooking,
    getsingleBookingsFromDB,
};
