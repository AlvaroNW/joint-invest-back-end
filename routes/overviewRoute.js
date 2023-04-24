import * as overviewController from "../controllers/overviewControllers.js";

const overviewRoutes = Router();

overviewRoutes.route("/").get(portfolioController.findAllPortfolios);

overviewRoutes
  .route("/:userId")
  .get(overviewController.findAllUserSPortfolios);

export default overviewRoutes;