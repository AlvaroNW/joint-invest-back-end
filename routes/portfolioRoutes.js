import { Router } from "express";
import { getPortfolio } from "../controllers/portfolioController.js";
import { getStock } from "../controllers/stockDetailController.js";
import { setStatus } from "../controllers/portfolioController.js";

const portfolioRoute = Router();

portfolioRoute.route("/:portfolio_id").get(getPortfolio);
portfolioRoute.route("/:portfolio_id").post(setStatus);
portfolioRoute.route("/:portfolio_id/:ticker").get(getStock);

export default portfolioRoute;
