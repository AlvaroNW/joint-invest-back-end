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

    const portfolioInfo = {
      overview: portfolioData,
      stocks: stockData,
    };
    res.json(portfolioInfo);
  } catch (e) {
    next(e.message);
  }
};

const getPortfolioPending = async (req, res, next) => {
  try {
    const { portfolio_id } = req.params;

    const queryStocks =
      "SELECT sell.portfolio_id, sell.company_id, sell.average_price_sell, sell.number_of_shares_sell, buy.average_price_buy, buy.number_of_shares_buy FROM (SELECT portfolio_id, company_id, SUM(price_of_share * number_of_shares)/SUM(number_of_shares) as average_price_sell, SUM(number_of_shares) as number_of_shares_sell FROM Transactions WHERE type_of_transaction = 'Sell' AND portfolio_id = $1 AND status = 'pending' GROUP BY portfolio_id, company_id) as sell LEFT JOIN (SELECT portfolio_id, company_id, SUM(price_of_share * number_of_shares)/SUM(number_of_shares) as average_price_buy, SUM(number_of_shares) as number_of_shares_buy FROM Transactions WHERE type_of_transaction = 'Buy' AND portfolio_id = $1 AND status = 'pending' GROUP BY portfolio_id, company_id) as buy ON sell.portfolio_id = buy.portfolio_id AND sell.company_id = buy.company_id UNION SELECT buy.portfolio_id, buy.company_id, sell.average_price_sell, sell.number_of_shares_sell, buy.average_price_buy, buy.number_of_shares_buy FROM (SELECT portfolio_id, company_id, SUM(price_of_share * number_of_shares)/SUM(number_of_shares) as average_price_sell, SUM(number_of_shares) as number_of_shares_sell FROM Transactions WHERE type_of_transaction = 'Sell' AND portfolio_id = $1 AND status = 'confirmed' GROUP BY portfolio_id, company_id) as sell RIGHT JOIN (SELECT portfolio_id, company_id, SUM(price_of_share * number_of_shares)/SUM(number_of_shares) as average_price_buy, SUM(number_of_shares) as number_of_shares_buy FROM Transactions WHERE type_of_transaction = 'Buy' AND portfolio_id = $1 AND status = 'pending' GROUP BY portfolio_id, company_id) as buy ON sell.portfolio_id = buy.portfolio_id AND sell.company_id = buy.company_id WHERE sell.portfolio_id IS NULL;";
    const { rows: stockData } = await pool.query(queryStocks, [portfolio_id]);

    stockData.map((stock) => {
      const buyn = stock.number_of_shares_buy;
      const selln = stock.number_of_shares_sell;
      stock.current_number_of_stocks = `${buyn - selln}`;
    });

    res.json(stockData);
  } catch (e) {
    next(e.message);
  }
};

const setStatus = async (req, res, next) => {
  try {
    const { portfolio_id } = req.params;

    const {
      user_id_status_request,
      current_portfolio_status,
      button_response,
    } = req.body;

    const today = new Date();

    let newPortfolioStatus = "";

    // console.log(user_id_status_request);
    // console.log(current_portfolio_status);
    // console.log(button_response);
    // console.log(portfolio_id);

    if (
      button_response === "confirmed" ||
      button_response === "deletion_requested"
    ) {
      switch (current_portfolio_status) {
        case "pending_activation":
          newPortfolioStatus = "activated";
          break;
        case "pending_deletion":
          newPortfolioStatus = "deleted";
          // console.log(newPortfolioStatus);
          break;
        case "activated":
          newPortfolioStatus = "pending_deletion";
          break;
        default:
          newPortfolioStatus = current_portfolio_status;
      }
    } else if (button_response === "rejected") {
      switch (current_portfolio_status) {
        case "pending_activation":
          newPortfolioStatus = "deleted";
          break;
        case "pending_deletion":
          newPortfolioStatus = "activated";
          break;
        default:
          newPortfolioStatus = current_portfolio_status;
      }
    } else {
      console.log("request not listed");
    }

    console.log(newPortfolioStatus);

    const query =
      "UPDATE portfolio SET status = $3, user_id_status_request=$2, request_creation_date=$4  WHERE id = $1;";

    const { rows: portfolioUpdated } = await pool.query(query, [
      portfolio_id,
      user_id_status_request,
      newPortfolioStatus,
      today,
    ]);

    res.json(portfolioUpdated);
  } catch (e) {
    res.json({ error: e.message });
  }
};

export { getPortfolio, setStatus, getPortfolioPending };
