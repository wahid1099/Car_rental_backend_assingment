import express from "express";
import { FeedBackControllers } from "./feedBack.controller";

const router = express.Router();

router.get("/get-all-feedbacks", FeedBackControllers.getAllFeedBacks);
router.post("/create-feedback", FeedBackControllers.createFeedback);

export const FeedbackRoutes = router;
