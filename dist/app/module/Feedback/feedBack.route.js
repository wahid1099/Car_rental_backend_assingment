"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackRoutes = void 0;
const express_1 = __importDefault(require("express"));
const feedBack_controller_1 = require("./feedBack.controller");
const router = express_1.default.Router();
router.get("/get-all-feedbacks", feedBack_controller_1.FeedBackControllers.getAllFeedBacks);
router.post("/create-feedback", feedBack_controller_1.FeedBackControllers.createFeedback);
exports.FeedbackRoutes = router;