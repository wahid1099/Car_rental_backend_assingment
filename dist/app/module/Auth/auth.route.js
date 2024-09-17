"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("../User/user.validation");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const user_constant_1 = require("../User/user.constant");
const auth_1 = __importDefault(require("../../middleware/auth"));
// Defining the auth router and its routes.
const router = express_1.default.Router();
router.get("/all-user", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), auth_controller_1.AuthController.getAllUserFromDb);
router.get("/me", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), auth_controller_1.AuthController.getMefromDb);
router.post("/signup", (0, validateRequest_1.default)(user_validation_1.UserValidation.userValidationSchema), auth_controller_1.AuthController.signUp);
router.post("/signin", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.singInValidationSchema), auth_controller_1.AuthController.signIn);
router.post("/refresh-token", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.refreshTokenValidationSchema), auth_controller_1.AuthController.refreshTokenFromDb);
router.put("/user-update", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), (0, validateRequest_1.default)(user_validation_1.UserValidation.userValidationSchema), auth_controller_1.AuthController.updateUserFromDb);
router.delete("/:userId", auth_controller_1.AuthController.deleteFromDb);
router.patch("/update-role/:userId", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), auth_controller_1.AuthController.makeAdmin);
// Exporting the auth router.
exports.AuthRouter = router;
