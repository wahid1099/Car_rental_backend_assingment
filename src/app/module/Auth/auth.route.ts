import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { UserValidation } from "../User/user.validation";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import { USER_ROLE } from "../User/user.constant";
import Auth from "../../middleware/auth";

// Defining the auth router and its routes.
const router = express.Router();

router.get("/all-user", Auth(USER_ROLE.admin), AuthController.getAllUserFromDb);

router.get(
  "/me",
  Auth(USER_ROLE.admin, USER_ROLE.user),
  AuthController.getMefromDb
);

router.post(
  "/signup",
  validateRequest(UserValidation.userValidationSchema),
  AuthController.signUp
);

router.post(
  "/signin",
  validateRequest(AuthValidation.singInValidationSchema),
  AuthController.signIn
);
router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshTokenFromDb
);

router.put(
  "/user-update",
  Auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(UserValidation.userValidationSchema),
  AuthController.updateUserFromDb
);

router.delete(
  "/delete-user/:userId",
  Auth(USER_ROLE.admin),
  AuthController.deleteFromDb
);
router.patch(
  "/update-role/:userId",
  Auth(USER_ROLE.admin),
  AuthController.makeAdmin
);

// Exporting the auth router.
export const AuthRouter = router;
