import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FeedBackService } from "./feedback.service";

const createFeedback = catchAsync(async (req, res) => {
  const newFeedback = await FeedBackService.createFeedBack(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "FeedBack created successfully!",
    data: newFeedback,
  });
  return newFeedback;
});

const getAllFeedBacks = catchAsync(async (req, res) => {
  const allFeedbacks = await FeedBackService.getAllFeedBacks();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All Feedbacks retrieved successfully!",
    data: allFeedbacks,
  });
  return allFeedbacks;
});

export const FeedBackControllers = {
  createFeedback,
  getAllFeedBacks,
};
