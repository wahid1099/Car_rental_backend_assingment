import { TFeedBack } from "./feedback.interface";
import { FeedBack } from "./feedBack.model";

const createFeedBack = async (payload: TFeedBack) => {
  const feedback = await FeedBack.create(payload);
  return feedback;
};

const getAllFeedBacks = async () => {
  const result = await FeedBack.find();
  return result;
};

export const FeedBackService = {
  createFeedBack,
  getAllFeedBacks,
};
