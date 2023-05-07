import pool from "../DB/client.js";
import { cryptoCache } from "../middleware/cache.js";

export const findAllPortfolios = async (req, res, next) => {
  try {
    if (cryptoCache.has("myPortfolios")) {
      console.log("using manual cache! --> findAllPortfolios");
      return res.json(cryptoCache.get("myPortfolios"));
    }
    const { rows: portfolios } = await pool.query("SELECT * FROM portfolio");
    console.log("using DB call! --> findAllPortfolios");
    cryptoCache.set("myPortfolios", portfolios);
    return res.json(portfolios);
  } catch (e) {
    next(e.message);
  }
};

export const findAllUserSPortfolios = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (
      cryptoCache.has(`oneUserPortfolio_${userId}`) &&
      cryptoCache.has(`onePortfolioWallet_${userId}`)
    ) {
      console.log("using manual cache! --> findAllUserPortfolios");
      return res.json({
        portfolios: cryptoCache.get(`oneUserPortfolio_${userId}`),
        portfoliosDetails: cryptoCache.get(`onePortfolioWallet_${userId}`),
      });
    }
    const { rows: userSPortfolios } = await pool.query(
      "SELECT usertoportfolio.user_id AS friend_id, users.username AS friend_username, portfolio.id AS portfolio_id, initial_amount,name_of_portfolio,invested_amount,available_amount, SUM(wallet.number_of_shares*wallet.average_price) AS total_buying_value, status AS portfolio_status, user_id_status_request AS user_id_request, date_created AS portfolio_creation_date, request_creation_date FROM portfolio LEFT JOIN wallet ON portfolio.id=wallet.portfolio_id RIGHT JOIN usertoportfolio ON portfolio.id = usertoportfolio.portfolio_id RIGHT JOIN users ON usertoportfolio.user_id = users.id WHERE usertoportfolio.portfolio_id IN (SELECT portfolio_id FROM usertoportfolio WHERE user_id=$1)AND usertoportfolio.user_id!=$1 GROUP BY wallet.portfolio_id, initial_amount, name_of_portfolio,invested_amount,available_amount, users.username,usertoportfolio.user_id, portfolio.id",
      [userId]
    );
    const { rows: portfolioWalletDetails } = await pool.query(
      "SELECT t.portfolio_id, t.company_id, usertoportfolio.user_id, t.net_shares AS number_of_shares, t.status FROM usertoportfolio RIGHT JOIN (SELECT company_id, portfolio_id, status, SUM(CASE WHEN type_of_transaction = 'Buy' THEN number_of_shares ELSE -number_of_shares END) AS net_shares FROM transactions WHERE status = 'confirmed' GROUP BY company_id, portfolio_id,status) AS t ON t.portfolio_id = usertoportfolio.portfolio_id WHERE usertoportfolio.user_id=$1",
      [userId]
    );
    console.log("using DB call! --> findAllUserPortfolios");
    cryptoCache.set(`oneUserPortfolio_${userId}`, userSPortfolios);
    cryptoCache.set(`onePortfolioWallet_${userId}`, portfolioWalletDetails);
    return res.json({
      portfolios: userSPortfolios,
      portfoliosDetails: portfolioWalletDetails,
    });
  } catch (e) {
    next(e.message);
  }
};
