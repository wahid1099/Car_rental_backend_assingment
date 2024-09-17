import moment from "moment";

export const calculateTotalPrice = (
  pickUpDate: string,
  pickTime: string,
  pricePerhour: number = 60
) => {
  const pickUpDateTime = moment(
    `${pickUpDate}T${pickTime}`,
    "DD-MM-YYYYTHH:mm"
  );
  const dropOffDateTime = moment();

  //calculate duration in hours

  const duration = moment.duration(dropOffDateTime.diff(pickUpDateTime));
  const hours = duration.hours();
  const minitues = duration.minutes();
  // calculate cost
  let totalCost = 0;

  if (minitues > 0 && minitues <= 30) {
    totalCost += pricePerhour / 2;
  } else if (minitues > 30 && minitues <= 60) {
    totalCost += pricePerhour;
  }

  //add full cost for the remaining hours
  totalCost += hours * pricePerhour;

  const dropOffDate = dropOffDateTime.format("DD-MM-YYYY");
  const dropTime = dropOffDateTime.format("HH:mm");

  return {
    totalCost,
    dropOffDate,
    dropTime,
  };
};
