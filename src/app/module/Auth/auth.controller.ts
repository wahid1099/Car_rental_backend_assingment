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
  const { user, accessToken, refreshToken } = await AuthService.createSingIn(
    req.body
  );

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production" ? true : false,
    httpOnly: true,
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User logged in successfully",
    data: user,
    token: accessToken,
  });
});

const refreshTokenFromDb = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshTokenIntoDb(refreshToken);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Token refreshed successfully",
    data: result,
  });
});

const getAllUserFromDb = catchAsync(async (req, res) => {
  const result = await AuthService.getAllUserInDb();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All Users retrieved successfully!",
    data: result,
  });
});

const updateUserFromDb = catchAsync(async (req, res) => {
  const { userEmail } = req.user;

  const result = await AuthService.updateUseriIntoDb(userEmail, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User data updated successfully!",
    data: result,
  });
});

const getMefromDb = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await AuthService.getMyId(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User data retrieved successfully!",
    data: result,
  });
});

const deleteFromDb = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await AuthService.deleteUserIntoDb(userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User data deleted successfully!",
    data: result,
  });
});

const makeAdmin = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await AuthService.toggleAdminRoleInDb(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User role updated successfully!",
    data: result,
  });
});
export const AuthController = {
  signUp,
  signIn,
  refreshTokenFromDb,
  getAllUserFromDb,
  updateUserFromDb,
  getMefromDb,
  deleteFromDb,
  makeAdmin,
};
