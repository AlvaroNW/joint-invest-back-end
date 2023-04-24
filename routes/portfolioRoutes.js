import { Router } from "express";
import {
  getPortfolio,
  getStock,
  postTransaction,
  putTransaction,
} from "../controllers/portfolioController.js";

const portfolioRoute = Router();

portfolioRoute.route("/:portfolio_id").get(getPortfolio);
portfolioRoute.route("/:portfolio_id/:ticker").get(getStock);
portfolioRoute.route("/transaction/:portfolio_id/").post(postTransaction);
portfolioRoute
  .route("/transaction/:portfolio_id/:transaction_id")
  .put(putTransaction);

export default portfolioRoute;
