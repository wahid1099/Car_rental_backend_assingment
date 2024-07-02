"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Car = void 0;
const mongoose_1 = require("mongoose");
const carSchema = new mongoose_1.Schema({
    name: { type: String, required: [true, "Car name must be required"] },
    description: {
        type: String,
        required: [true, "Car description must be required"],
    },
    color: { type: String, required: [true, "Car color must be required"] },
    isElectric: { type: Boolean, required: [true, "isElectric Is required"] },
    features: { type: [String], required: [true, "Features is required"] },
    isDelete: { type: Boolean, default: false },
    pricePerHour: { type: Number, required: [true, "PricePerhour is required"] },
    status: { type: String, default: "available" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
exports.Car = (0, mongoose_1.model)("Car", carSchema);
