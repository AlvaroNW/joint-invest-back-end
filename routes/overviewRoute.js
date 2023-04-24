import { Router } from "express";
import * as overviewController from "../controllers/overviewControllers.js";

const overviewRoutes = Router();

overviewRoutes.route("/").get(overviewController.findAllPortfolios);

overviewRoutes.route("/:userId").get(overviewController.findAllUserSPortfolios);

export default overviewRoutes;
