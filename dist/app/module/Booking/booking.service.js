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
const BookingcarFromDB = (payload, userdata) => __awaiter(void 0, void 0, void 0, function* () {
    const userInformation = yield user_model_1.User.findOne({ email: userdata.userEmail });
    if (!userInformation) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User Not Found!!");
    }
    payload.car = payload.carId;
    const carData = yield car_model_1.Car.findById(payload.carId);
    if (!carData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Car Not found!!");
    }
    if (carData.status !== "available") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Car booking is not available!!");
    }
    payload.user = userInformation._id;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        carData.status = "unavailable";
        yield car_model_1.Car.create([carData], { session });
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
    const result = yield booking_model_1.Booking.find(filter).populate("car").populate("user");
    return result;
});
const getMyBookingsFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!(user === null || user === void 0 ? void 0 : user._id)) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not Found!!");
    }
    const bookings = yield booking_model_1.Booking.find({ user: user === null || user === void 0 ? void 0 : user._id })
        .populate("user")
        .populate("car");
    return bookings;
});
exports.BookingServices = {
    BookingcarFromDB,
    getAllBookingsFromDB,
    getMyBookingsFromDB,
};
