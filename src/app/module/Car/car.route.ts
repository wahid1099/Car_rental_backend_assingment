import express from "express";

import validateRequest from "../../middleware/validateRequest";

import { CarValidation } from "./car.validation";

import { CarControllers } from "./car.controller";

import Auth from "../../middleware/auth";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

//get methods
router.get("/search-cars", CarControllers.searchCars);
router.get("/:id", CarControllers.getSingleCar);

router.get("/", CarControllers.getAllCars);

//post methods
router.post(
  "/",
  Auth(USER_ROLE.admin),
  validateRequest(CarValidation.carSchemaValidation),
  CarControllers.createCar
);
//put methods

router.put(
  "/:id",
  validateRequest(CarValidation.carSchemaValidation),
  CarControllers.updateCar
);
router.put(
  "/return-car/:bookingId",
  Auth(USER_ROLE.admin),
  CarControllers.returnCar
);

router.delete("/:id", Auth(USER_ROLE.admin), CarControllers.delteCar);

export const CarRoutes = router;
