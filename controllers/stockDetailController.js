import pool from "../DB/client.js";
import { cryptoCache } from "../middleware/cache.js";

const getStock = async (req, res, next) => {
  try {
    const { portfolio_id, ticker } = req.params;
    const user_id = 1;

    const queryStocks =
      "SELECT sell.portfolio_id, sell.company_id,sell.average_price_sell, sell.number_of_shares_sell, buy.average_price_buy, buy.number_of_shares_buy FROM (SELECT portfolio_id, company_id, SUM(price_of_share * number_of_shares)/SUM(number_of_shares) as average_price_sell, SUM(number_of_shares) as number_of_shares_sell FROM Transactions WHERE type_of_transaction = 'Sell' AND portfolio_id = $1 AND status = 'confirmed' AND company_id = $2 GROUP BY portfolio_id, company_id) as sell INNER JOIN (SELECT portfolio_id, company_id, SUM(price_of_share * number_of_shares)/SUM(number_of_shares) as average_price_buy, SUM(number_of_shares) as number_of_shares_buy FROM Transactions WHERE type_of_transaction = 'Buy' AND portfolio_id = $1 AND status = 'confirmed' AND company_id = $2 GROUP BY portfolio_id, company_id) as buy ON sell.portfolio_id = buy.portfolio_id AND sell.company_id = buy.company_id;";
    const { rows: stockData } = await pool.query(queryStocks, [
      portfolio_id,
      ticker,
    ]);
    stockData.map((stock) => {
      const buyn = stock.number_of_shares_buy;
      const selln = stock.number_of_shares_sell;
      stock.current_number_of_stocks = `${buyn - selln}`;
    });

    return res.json(stockData);
  } catch (e) {
    next(e.message);
  }
};

const logoData = async (req, res, next) => {
  try {
    if (cryptoCache.has("myLogoData")) {
      console.log("manual cache --> LogoData");
      return res.json(cryptoCache.get("myLogoData"));
    }
    const newQuery = "SELECT * FROM company";
    const { rows: stockInfo } = await pool.query(newQuery);
    console.log("DB call --> LogoData");
    cryptoCache.set("myLogoData", stockInfo);
    return res.json(stockInfo);
  } catch (e) {
    next(e.message);
  }
};

export { getStock, logoData };
