import { executePaperOrder } from "../services/paperTrading";

const positions = executePaperOrder(
  [],
  {
    symbol: "QQQ",
    quantity: 10,
    price: 550,
    side: "BUY",
    placedAt: new Date().toISOString(),
  }
);

console.log(positions);
