import AppError from "../../error/AppError";
import { TUser } from "../User/user.interface";
import { User } from "../User/user.model";
import httpStatus from "http-status";
import { TSingInUser } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../config";

const createSingUp = async (userData: TUser) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User already Exists!!");
  }

  const newUser = new User(userData);
  const result = await newUser.save();
  return result;
};

const createSingIn = async (payload: TSingInUser) => {
  const user = await User.isUserExistByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "Uer not Found");
  }

  if (!(await User.isPasswordMatched(payload?.password, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password does not matched!");
  }

  const jwtPayload = {
    userEmail: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "10d",
  });

  return {
    user,
    accessToken: accessToken,
  };
};

export const AuthService = {
  createSingUp,
  createSingIn,
};
