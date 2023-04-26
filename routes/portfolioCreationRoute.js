import { Router } from "express";
import * as PCreationController from "../controllers/portfolioCreationController.js";

const portfolioCreationRoutes = Router();

portfolioCreationRoutes
  .route("/:userId")
  .post(PCreationController.createPortfolio);

export default portfolioCreationRoutes;
