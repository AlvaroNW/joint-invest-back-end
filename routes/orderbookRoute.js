import { Router } from "express";
import { getOrders } from "../controllers/orderbookController.js";

const orderbookRoute = Router();

orderbookRoute.route("/:portfolio_id").get(getOrders);

export default orderbookRoute;
