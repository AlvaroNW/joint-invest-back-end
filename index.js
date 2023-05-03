import Express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import portfolioRoute from "./routes/portfolioRoutes.js";
import orderbookRoute from "./routes/orderbookRoute.js";
import overviewRoutes from "./routes/overviewRoute.js";
import transactionRoute from "./routes/transactionRoute.js";
import { errorHandler } from "./middleware/errorHandler.js";
import portfolioCreationRoutes from "./routes/portfolioCreationRoute.js";
import userRoute from "./routes/userRoutes.js";
import { logoData } from "./controllers/stockDetailController.js";

const app = Express();

app.use(cors());
app.use(Express.json());
app.use(bodyParser.json());

const port = 3000;

app.use("/api/order_book", orderbookRoute);
app.use("/api/portfolio", portfolioRoute);
app.use("/api/overview", overviewRoutes);
app.use("/api/transaction", transactionRoute);
app.use("/api/creation_portfolio", portfolioCreationRoutes);
app.use("/api/user", userRoute);
app.get("/api/stocks", logoData);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
