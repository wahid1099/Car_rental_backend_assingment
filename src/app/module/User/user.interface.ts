import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export type TUser = {
  name: string;
  email: string;
  role: "user" | "admin";
  password: string;
  phone: string;
  address: string;
};

export interface UserModel extends Model<TUser> {
  isUserExistByEmail(email: string): Promise<TUser>;
  isPasswordMatched(
    palinTextPassword: string,
    hashedTextPassword: string
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
