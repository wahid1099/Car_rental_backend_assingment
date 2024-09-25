import { model, Schema } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const userSchema = new Schema<TUser, UserModel>(
  {
    name: { type: String, required: [true, "Name is required"] },
    password: { type: String, required: [true, "Password is required"] },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    phone: { type: String, required: [true, "Phone number is required"] },
    role: { type: String, enum: ["user", "admin"] },
    image: { type: String },
    isDeleted: { type: Boolean, default: false }, // Ensure this field exists

    // address: { type: String, required: [true, "Adress is required"] },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

userSchema.post("save", async function (doc, next) {
  doc.password = "";
  next();
});

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

// Static method to check if a user exists by

userSchema.statics.isUserExistByEmail = async function (email) {
  return await this.findOne({ email });
};

//static mathod to check if the password matches

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>("User", userSchema);
