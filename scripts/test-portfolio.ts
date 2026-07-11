import {
  calculatePortfolio,
} from "../services/portfolio";

console.log(
  calculatePortfolio([
    {
      symbol: "QQQ",
      quantity: 10,
      averagePrice: 500,
      currentPrice: 510,
    },
    {
      symbol: "NVDA",
      quantity: 5,
      averagePrice: 160,
      currentPrice: 170,
    },
  ])
);
