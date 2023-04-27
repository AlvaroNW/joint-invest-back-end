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
      "SELECT sell.portfolio_id, sell.company_id, sell.average_price_sell, sell.number_of_shares_sell, buy.average_price_buy, buy.number_of_shares_buy FROM (SELECT portfolio_id, company_id, SUM(price_of_share * number_of_shares)/SUM(number_of_shares) as average_price_sell, SUM(number_of_shares) as number_of_shares_sell FROM Transactions WHERE type_of_transaction = 'Sell' AND portfolio_id = $1 AND status = 'confirmed' GROUP BY portfolio_id, company_id) as sell LEFT JOIN (SELECT portfolio_id, company_id, SUM(price_of_share * number_of_shares)/SUM(number_of_shares) as average_price_buy, SUM(number_of_shares) as number_of_shares_buy FROM Transactions WHERE type_of_transaction = 'Buy' AND portfolio_id = $1 AND status = 'confirmed' GROUP BY portfolio_id, company_id) as buy ON sell.portfolio_id = buy.portfolio_id AND sell.company_id = buy.company_id UNION SELECT buy.portfolio_id, buy.company_id, sell.average_price_sell, sell.number_of_shares_sell, buy.average_price_buy, buy.number_of_shares_buy FROM (SELECT portfolio_id, company_id, SUM(price_of_share * number_of_shares)/SUM(number_of_shares) as average_price_sell, SUM(number_of_shares) as number_of_shares_sell FROM Transactions WHERE type_of_transaction = 'Sell' AND portfolio_id = $1 AND status = 'confirmed' GROUP BY portfolio_id, company_id) as sell RIGHT JOIN (SELECT portfolio_id, company_id, SUM(price_of_share * number_of_shares)/SUM(number_of_shares) as average_price_buy, SUM(number_of_shares) as number_of_shares_buy FROM Transactions WHERE type_of_transaction = 'Buy' AND portfolio_id = $1 AND status = 'confirmed' GROUP BY portfolio_id, company_id) as buy ON sell.portfolio_id = buy.portfolio_id AND sell.company_id = buy.company_id WHERE sell.portfolio_id IS NULL;";
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

const deletePortfolio = async (req, res) => {
  const { id } = req.params;

  try {
    const { id } = req.params;

    const queryRetrieveData = "SELECT * from portfolio WHERE id=$1";
    const queryDeletion =
      "UPDATE portfolio SET status = 'pending' WHERE id = $1;";

    const { rows: portfolioData } = await pool.query(queryRetrieveData, [id]);
    const { rows: portfolioDeleted } = await pool.query(queryDeletion, [id]);

    return res.json(portfolioDeleted, portfolioData);
  } catch (error) {
    res.json({ error: e.message });
  }
};

export { getPortfolio, deletePortfolio };
