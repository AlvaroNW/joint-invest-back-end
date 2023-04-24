import { Router } from "express";
import * as portfolioController from "../controllers/portfolioController.js";

const portfolioRoutes = Router();

portfolioRoutes.route("/").get(portfolioController.findAllPortfolios);

portfolioRoutes
  .route("/:userId")
  .get(portfolioController.findAllUserSPortfolios);

export default portfolioRoutes;
