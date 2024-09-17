"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotalPrice = void 0;
const moment_1 = __importDefault(require("moment"));
const calculateTotalPrice = (pickUpDate, pickTime, pricePerhour = 60) => {
    const pickUpDateTime = (0, moment_1.default)(`${pickUpDate}T${pickTime}`, "DD-MM-YYYYTHH:mm");
    const dropOffDateTime = (0, moment_1.default)();
    //calculate duration in hours
    const duration = moment_1.default.duration(dropOffDateTime.diff(pickUpDateTime));
    const hours = duration.hours();
    const minitues = duration.minutes();
    // calculate cost
    let totalCost = 0;
    if (minitues > 0 && minitues <= 30) {
        totalCost += pricePerhour / 2;
    }
    else if (minitues > 30 && minitues <= 60) {
        totalCost += pricePerhour;
    }
    //add full cost for the remaining hours
    totalCost += hours * pricePerhour;
    const dropOffDate = dropOffDateTime.format("DD-MM-YYYY");
    const dropTime = dropOffDateTime.format("HH:mm");
    return {
        totalCost,
        dropOffDate,
        dropTime,
    };
};
exports.calculateTotalPrice = calculateTotalPrice;
