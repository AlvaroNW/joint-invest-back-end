import Express, { Router } from "express";
import pkg from "./DB/client.js";
import bodyParser from "body-parser";
import portfolioRoutes from "./routes/portfolioRoutes.js";

const app = Express();
app.use(bodyParser.json());
const port = 3000;

// app.get('/', (req, res) => {
//   res.send('Backend for Joint Invest - from the Beehive with &#x2764;&#xFE0F;!')
// })

app.use("/", portfolioRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
