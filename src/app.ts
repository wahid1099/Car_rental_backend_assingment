import express, { Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";

const app = express();

//parser
app.use(express.json());

app.use(cors());
//application routes
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Car Rental Reservation System");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
