import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export type TUser = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  password: string;
  phone: string;

  image?: string;
  isDeleted: boolean;
  // address?: string;
};

export interface UserModel extends Model<TUser> {
  isUserExistByEmail(email: string): Promise<TUser>;
  isPasswordMatched(
    palinTextPassword: string,
    hashedTextPassword: string
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
