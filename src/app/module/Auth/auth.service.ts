import AppError from "../../error/AppError";
import { TUser } from "../User/user.interface";
import { User } from "../User/user.model";
import httpStatus from "http-status";
import { TSingInUser } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../config";
import { verifyToken } from "./auth.constant";
import { runInThisContext } from "vm";

const createSingUp = async (userData: TUser) => {
  // Checking if the user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, "User already Exists!!");
  }

  const newUser = new User(userData);
  const result = await newUser.save();
  return result;
};

//sing in
const createSingIn = async (payload: TSingInUser) => {
  const user = await User.isUserExistByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "Uer not Found");
  }

  if (!(await User.isPasswordMatched(payload?.password, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password does not matched!");
  }

  const jwtPayload = {
    userId: user?._id,
    userEmail: user.email,
    role: user.role,
    name: user.name,
    image: user.image,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "10m",
  });

  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    { expiresIn: "10d" }
  );
  return {
    user,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

//All user from db
const getAllUserInDb = async () => {
  const result = await User.find();
  return result;
};

//generating refresh token
const refreshTokenIntoDb = async (token: string) => {
  const refreshTokenPayload = verifyToken(
    token,
    config.jwt_refresh_secret as string
  );
  if (!refreshTokenPayload) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid refresh token!");
  }

  const { userEmail } = refreshTokenPayload;
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User no found");
  }

  const jwtPayload = {
    userId: user._id,
    userEmail: user.email,
    role: user.role,
    name: user.name,
    image: user.image,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "10m",
  });
  return {
    accessToken,
  };
};

//User data update
const updateUseriIntoDb = async (
  userEmail: string,
  payload: Partial<TUser>
) => {
  const user = await User.findOne({ email: userEmail });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not found!!");
  }
  const result = await User.findByIdAndUpdate(user?._id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const getMyId = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not Found !!");
  }
  return user;
};

const deleteUserIntoDb = async (userId: string) => {
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not found!!");
  }
  const reuslt = await User.findByIdAndUpdate(
    userId,
    { isDeleted: true },
    { new: true }
  );
  return reuslt;
};

const toggleAdminRoleInDb = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const Newrole = user.role == "admin" ? "user" : "admin";
  const result = await User.findByIdAndUpdate(
    userId,
    { role: Newrole },
    { new: true }
  );
  return result;
};
export const AuthService = {
  createSingUp,
  createSingIn,
  refreshTokenIntoDb,
  getAllUserInDb,
  updateUseriIntoDb,
  getMyId,
  deleteUserIntoDb,
  toggleAdminRoleInDb,
};
