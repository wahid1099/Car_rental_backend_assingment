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
exports.CarServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const car_model_1 = require("./car.model");
const mongoose_1 = __importDefault(require("mongoose"));
const booking_model_1 = require("../Booking/booking.model");
const createCarIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const car = yield car_model_1.Car.create(payload);
    return car;
});
const getAllCarsFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.Car.find();
    return result;
});
const getSingleCarFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.Car.findById(id);
    return result;
});
const updateCarIntoDb = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedPayload = Object.assign(Object.assign({}, payload), { updatedAt: new Date() });
    const result = yield car_model_1.Car.findByIdAndUpdate({ _id: id }, updatedPayload, {
        new: true,
    });
    return result;
});
const deleteCarFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.Car.findByIdAndUpdate({ _id: id }, { isDelete: true }, {
        new: true,
    });
    return result;
});
const returnCarIntoDb = (bookingId, endTime) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const booking = yield booking_model_1.Booking.findById(bookingId).session(session);
        if (!booking) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking Not Found!!");
        }
        const car = yield car_model_1.Car.findById(booking.car).session(session);
        if (!car) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Car Not Found!!");
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
        yield car_model_1.Car.findByIdAndUpdate(car._id, { status: "available" }, { new: true, session });
        // Updating the booking with endTime and totalCost
        const updatedBooking = yield booking_model_1.Booking.findByIdAndUpdate(bookingId, { endTime, totalCost }, { new: true, session })
            .populate("car")
            .populate("user");
        yield session.commitTransaction();
        yield session.endSession();
        return updatedBooking;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error.message);
    }
});
exports.CarServices = {
    createCarIntoDB,
    getAllCarsFromDb,
    getSingleCarFromDb,
    updateCarIntoDb,
    deleteCarFromDb,
    returnCarIntoDb,
};
