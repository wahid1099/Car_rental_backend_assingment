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
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmationsService = void 0;
const path_1 = require("path");
const promises_1 = require("fs/promises");
const booking_model_1 = require("../Booking/booking.model");
// import { verifyPayment } from "../../utils/PaymentGatway";
const confirmationsService = (transactionId, status, bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const verifyResponse = await verifyPayment(transactionId);
        const verifyResponse = "Successful";
        let message = "";
        if (verifyResponse && verifyResponse === "Successful") {
            yield booking_model_1.Booking.findOneAndUpdate({ _id: bookingId }, {
                transactionId: transactionId,
                paymentStatus: "paid",
            }, { new: true });
            message = "Payment Successfully Paid!";
        }
        else {
            message = "Payment Failed!";
        }
        const filePath = (0, path_1.join)(__dirname, "../../template/confirmation.html");
        let template = yield (0, promises_1.readFile)(filePath, "utf8");
        template = template.replace("{{message}}", message);
        return template;
    }
    catch (error) {
        console.error("Error in confirmationService:", error);
        return "<h1>Internal Server Error</h1>";
    }
});
exports.confirmationsService = confirmationsService;
