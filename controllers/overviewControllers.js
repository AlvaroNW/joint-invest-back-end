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
      "SELECT wallet.portfolio_id, initial_amount,name_of_portfolio,invested_amount,available_amount, SUM(wallet.number_of_shares*wallet.average_price) AS total_buying_value FROM portfolio LEFT JOIN wallet ON portfolio.id=wallet.portfolio_id RIGHT JOIN usertoportfolio ON portfolio.id = usertoportfolio.portfolio_id WHERE user_id = $1 GROUP BY wallet.portfolio_id, initial_amount, name_of_portfolio,invested_amount,available_amount",
      [userId]
    );
    return res.json(userSPortfolios);
  } catch (error) {
    console.log(error.message);
  }
};

// export const findPortfolioFriend = async (req, res)=>{
//     try {
//        const {portfolioId} =

//     } catch (error) {

//     }
// }
