import { join } from "path";
import { readFile } from "fs/promises";
import { Booking } from "../Booking/booking.model";
// import { verifyPayment } from "../../utils/PaymentGatway";

export const confirmationsService = async (
  transactionId: string,
  status: string,
  bookingId: string
) => {
  try {
    // const verifyResponse = await verifyPayment(transactionId);
    const verifyResponse = "Successful";

    let message = "";
    if (verifyResponse && verifyResponse === "Successful") {
      await Booking.findOneAndUpdate(
        { _id: bookingId },
        {
          transactionId: transactionId,
          paymentStatus: "paid",
        },
        { new: true }
      );
      message = "Payment Successfully Paid!";
    } else {
      message = "Payment Failed!";
    }

    const filePath = join(__dirname, "../../template/confirmation.html");
    let template = await readFile(filePath, "utf8");

    template = template.replace("{{message}}", message);
    return template;
  } catch (error) {
    console.error("Error in confirmationService:", error);
    return "<h1>Internal Server Error</h1>";
  }
};
