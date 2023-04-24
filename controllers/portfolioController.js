import pool from "../DB/client.js";

const getPortfolio = async (req, res, next) => {
  try {
    const { portfolio_id } = req.params;
    const user_id = 1;

    const queryPortfolio = "SELECT * FROM Portfolio WHERE id = $1";
    const { rows: portfolioData } = await pool.query(queryPortfolio, [
      portfolio_id,
    ]);

    const queryStocks =
      "SELECT sell.portfolio_id, sell.company_id,sell.average_price_sell, sell.number_of_shares_sell, buy.average_price_buy, buy.number_of_shares_buy FROM (SELECT portfolio_id, company_id, SUM(price_of_share * number_of_shares)/SUM(number_of_shares) as average_price_sell, SUM(number_of_shares) as number_of_shares_sell FROM Transactions WHERE type_of_transaction = 'Sell' AND portfolio_id = $1 AND status = 'confirmed' GROUP BY portfolio_id, company_id) as sell INNER JOIN (SELECT portfolio_id, company_id, SUM(price_of_share * number_of_shares)/SUM(number_of_shares) as average_price_buy, SUM(number_of_shares) as number_of_shares_buy FROM Transactions WHERE type_of_transaction = 'Buy' AND portfolio_id = $1 AND status = 'confirmed' GROUP BY portfolio_id, company_id) as buy ON sell.portfolio_id = buy.portfolio_id AND sell.company_id = buy.company_id;";
    const { rows: stockData } = await pool.query(queryStocks, [portfolio_id]);

    stockData.map((stock) => {
      const buyn = stock.number_of_shares_buy;
      const selln = stock.number_of_shares_sell;
      stock.current_number_of_stocks = `${buyn - selln}`;
    });

    const portfolioInfo = { overview: portfolioData, stocks: stockData };
    res.json(portfolioInfo);
  } catch (e) {
    res.json({ error: e.message });
  }
};

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

    res.json(stockData);
  } catch (e) {
    res.json({ error: e.message });
  }
};

const postTransaction = async (req, res, next) => {
  try {
    res.json({ "Under construction": "do not disturb" });
  } catch (e) {
    res.json({ error: e.message });
  }
};

const putTransaction = async (req, res, next) => {
  try {
    res.json({ "Under construction": "do not disturb" });
  } catch (e) {
    res.json({ error: e.message });
  }
};

export { getPortfolio, getStock, postTransaction, putTransaction };
