import Express, { Router } from "express";
import pkg from "./DB/client.js";
import bodyParser from "body-parser";
import cors from "cors";
import portfolioRoute from "./routes/portfolioRoutes.js";
import orderbookRoute from "./routes/orderbookRoute.js";

const app = Express();

app.use(cors());
app.use(Express.json());
app.use(bodyParser.json());

const port = 3000;

app.use("/api/order_book", orderbookRoute);
app.use("/api/portfolio", portfolioRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
