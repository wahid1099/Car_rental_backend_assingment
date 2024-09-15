import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import httpStatus from "http-status";
import config from "../../config";
const signUp = catchAsync(async (req, res) => {
  const userData = req.body;
  const newUser = await AuthService.createSingUp(userData);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User registered successfully",
    data: newUser,
  });
});

const signIn = catchAsync(async (req, res) => {
  const { user, accessToken } = await AuthService.createSingIn(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User logged in successfully",
    data: user,
    token: accessToken,
  });
});

export const AuthController = {
  signUp,
  signIn,
};
