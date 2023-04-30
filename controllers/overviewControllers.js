import pool from "../DB/client.js";

export const findAllPortfolios = async (req, res) => {
  try {
    const { rows: portfolios } = await pool.query("SELECT * FROM portfolio");
    return res.json(portfolios);
  } catch (error) {
    console.log(error.message);
  }
};

export const findAllUserSPortfolios = async (req, res) => {
  try {
    const { userId } = req.params;
    const { rows: userSPortfolios } = await pool.query(
      "SELECT usertoportfolio.user_id AS friend_id, users.username AS friend_username, portfolio.id AS portfolio_id, initial_amount,name_of_portfolio,invested_amount,available_amount, SUM(wallet.number_of_shares*wallet.average_price) AS total_buying_value, status AS portfolio_status, user_id_status_request AS user_id_request FROM portfolio LEFT JOIN wallet ON portfolio.id=wallet.portfolio_id RIGHT JOIN usertoportfolio ON portfolio.id = usertoportfolio.portfolio_id RIGHT JOIN users ON usertoportfolio.user_id = users.id WHERE usertoportfolio.portfolio_id IN (SELECT portfolio_id FROM usertoportfolio WHERE user_id=$1)AND usertoportfolio.user_id!=$1 GROUP BY wallet.portfolio_id, initial_amount, name_of_portfolio,invested_amount,available_amount, users.username,usertoportfolio.user_id, portfolio.id",
      [userId]
    );
    const { rows: portfolioWalletDetails } = await pool.query(
      "SELECT wallet.portfolio_id, wallet.company_id, wallet.number_of_shares, usertoportfolio.user_id FROM wallet RIGHT JOIN usertoportfolio ON wallet.portfolio_id = usertoportfolio.portfolio_id WHERE usertoportfolio.user_id=$1 AND wallet.portfolio_id IS NOT NULL",
      [userId]
    );

    return res.json({
      portfolios: userSPortfolios,
      portfoliosDetails: portfolioWalletDetails,
    });
  } catch (error) {
    console.log(error.message);
  }
};
