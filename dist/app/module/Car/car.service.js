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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const moment_1 = __importDefault(require("moment"));
const car_model_1 = require("./car.model");
const mongoose_1 = __importDefault(require("mongoose"));
const booking_model_1 = require("../Booking/booking.model");
const car_utils_1 = require("./car.utils");
//creating new car
const createCarIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const car = yield car_model_1.Car.create(payload);
    return car;
});
//getting all cars
const getAllCarsFromDb = (name, carType, location, price) => __awaiter(void 0, void 0, void 0, function* () {
    let query = {
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
    const result = yield car_model_1.Car.find(query);
    return result;
});
//getting single car
const getSingleCarFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.Car.findById(id);
    return result;
});
//updating car data
const updateCarIntoDb = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { vehicleSpecification, features } = payload, reemainingPayload = __rest(payload, ["vehicleSpecification", "features"]);
    const modifideUpdateData = Object.assign({}, reemainingPayload);
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
    const result = yield car_model_1.Car.findOneAndUpdate({ _id: id }, modifideUpdateData, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteCarFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.Car.findByIdAndUpdate({ _id: id }, { isDelete: true }, {
        new: true,
    });
    return result;
});
const returnCarIntoDb = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const booking = yield booking_model_1.Booking.findById(bookingId).session(session);
        if (!booking) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking Not Found!!");
        }
        const car = yield car_model_1.Car.findById(booking.car).session(session);
        if (!car) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Car Not Found!!");
        }
        // Get the current date and time
        const currentDate = new Date();
        const dropOffDate = (0, moment_1.default)(currentDate).format("DD-MM-YYYY"); // Format as required (DD-MM-YYYY)
        const dropTime = (0, moment_1.default)(currentDate).format("HH:mm"); // Format time as 24-hour (HH:mm)
        const { pickUpDate, pickTime } = booking;
        const pricePerHour = car.pricePerHour;
        const { totalCost } = (0, car_utils_1.calculateTotalPrice)(pickUpDate, pickTime, pricePerHour);
        // Update booking with total cost, dropOffDate, and dropTime
        booking.totalCost = totalCost;
        booking.dropOffDate = dropOffDate;
        booking.dropTime = dropTime;
        booking.status = "completed";
        yield booking.save({ session });
        // Update car status to available
        car.status = "available";
        yield car.save({ session });
        // Re-query the booking to populate the car and user fields
        const populatedBooking = yield booking_model_1.Booking.findById(bookingId)
            .populate("car")
            .populate("user")
            .session(session);
        yield session.commitTransaction();
        session.endSession();
        return populatedBooking;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error.message);
    }
});
// searching a  car from database
const searchCarsFromDB = (_a) => __awaiter(void 0, [_a], void 0, function* ({ features, carType, seats, }) {
    const query = { status: "available" };
    if (carType) {
        query.carType = carType;
    }
    if (seats) {
        query.maxSeats = seats;
    }
    if (features) {
        query.features = { $in: [features] };
    }
    const result = yield car_model_1.Car.find(query);
    return result;
});
exports.CarServices = {
    createCarIntoDB,
    getAllCarsFromDb,
    getSingleCarFromDb,
    updateCarIntoDb,
    deleteCarFromDb,
    returnCarIntoDb,
    searchCarsFromDB,
};
