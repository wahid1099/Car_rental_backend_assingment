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
exports.CarControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const car_service_1 = require("./car.service");
const createCar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_service_1.CarServices.createCarIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Car created succesfully",
        data: result,
    });
}));
const getAllCars = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, carType, location, price } = req.query;
    const result = yield car_service_1.CarServices.getAllCarsFromDb(name, carType, location, parseInt(price));
    result.length < 1
        ? (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.NOT_FOUND,
            message: "Data Not Found!",
            data: result,
        })
        : (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: 200,
            message: "Cars retrieved successfully",
            data: result,
        });
}));
const getSingleCar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield car_service_1.CarServices.getSingleCarFromDb(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "A Car retrieved successfully",
        data: result,
    });
}));
const updateCar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield car_service_1.CarServices.updateCarIntoDb(id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Car updated successfully",
        data: result,
    });
}));
const delteCar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield car_service_1.CarServices.deleteCarFromDb(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Car Deleted successfully",
        data: result,
    });
}));
const returnCar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingId = req.params.bookingId;
    const result = yield car_service_1.CarServices.returnCarIntoDb(bookingId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Car returned Successfully!!",
        data: result,
    });
}));
// search car
const searchCars = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { features, seats, carType } = req.query;
    const result = yield car_service_1.CarServices.searchCarsFromDB({
        features,
        carType,
        seats,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Cars searched successfully!",
        data: result,
    });
}));
exports.CarControllers = {
    createCar,
    getAllCars,
    getSingleCar,
    updateCar,
    delteCar,
    returnCar,
    searchCars,
};
