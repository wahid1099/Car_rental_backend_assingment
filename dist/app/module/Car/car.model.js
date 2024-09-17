"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Car = void 0;
const mongoose_1 = require("mongoose");
const carSchema = new mongoose_1.Schema({
    name: { type: String, required: [true, "Car name is required"] },
    description: {
        type: String,
        required: [true, "Car description is required"],
    },
    color: { type: String, required: [true, "Car color is required"] },
    isElectric: { type: Boolean, required: [true, "isElectric is required"] },
    features: { type: [String], required: [true, "Features are required"] },
    isDelete: { type: Boolean, default: false },
    pricePerHour: {
        type: Number,
        required: [true, "Price per hour is required"],
    },
    status: { type: String, default: "available" },
    carImgUrl: {
        type: [String],
        required: [true, "Car image URL is required"],
    },
    vehicleSpecification: {
        type: [String],
        required: [true, "Vehicle specifications are required"],
    },
    maxSeats: { type: Number, required: [true, "Max seats are required"] },
    rating: { type: Number, default: 0 },
    gearType: { type: String, required: [true, "Gear type is required"] },
    fuelType: { type: String, required: [true, "Fuel type is required"] },
    carType: { type: String, required: [true, "Car type is required"] },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});
exports.Car = (0, mongoose_1.model)("Car", carSchema);
