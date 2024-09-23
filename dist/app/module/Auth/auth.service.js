"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_model_1 = require("../User/user.model");
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const auth_constant_1 = require("./auth.constant");
const createSingUp = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // Checking if the user already exists
    const existingUser = yield user_model_1.User.findOne({ email: userData.email });
    if (existingUser) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "User already Exists!!");
    }
    const newUser = new user_model_1.User(userData);
    const result = yield newUser.save();
    return result;
});
//sing in
const createSingIn = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExistByEmail(payload.email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Uer not Found");
    }
    if (!(yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user.password))) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Password does not matched!");
    }
    const jwtPayload = {
        userId: user === null || user === void 0 ? void 0 : user._id,
        userEmail: user.email,
        role: user.role,
        name: user.name,
        image: user.image,
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: "10d",
    });
    const refreshToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_refresh_secret, { expiresIn: "10d" });
    return {
        user,
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
});
//All user from db
const getAllUserInDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find();
    return result;
});
//generating refresh token
const refreshTokenIntoDb = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshTokenPayload = (0, auth_constant_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    if (!refreshTokenPayload) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid refresh token!");
    }
    const { userEmail } = refreshTokenPayload;
    const user = yield user_model_1.User.findOne({ email: userEmail });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User no found");
    }
    const jwtPayload = {
        userId: user._id,
        userEmail: user.email,
        role: user.role,
        name: user.name,
        image: user.image,
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: "10m",
    });
    return {
        accessToken,
    };
});
//User data update
const updateUseriIntoDb = (userEmail, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: userEmail });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User Not found!!");
    }
    const result = yield user_model_1.User.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const getMyId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not Found !!");
    }
    return user;
});
const deleteUserIntoDb = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ _id: userId });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User Not found!!");
    }
    const reuslt = yield user_model_1.User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true });
    return reuslt;
});
const toggleAdminRoleInDb = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const Newrole = user.role == "admin" ? "user" : "admin";
    const result = yield user_model_1.User.findByIdAndUpdate(userId, { role: Newrole }, { new: true });
    return result;
});
exports.AuthService = {
    createSingUp,
    createSingIn,
    refreshTokenIntoDb,
    getAllUserInDb,
    updateUseriIntoDb,
    getMyId,
    deleteUserIntoDb,
    toggleAdminRoleInDb,
};
