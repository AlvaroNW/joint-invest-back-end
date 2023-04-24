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
      "SELECT * FROM usertoportfolio RIGHT JOIN portfolio ON usertoportfolio.portfolio_id = portfolio.id FULL OUTER JOIN wallet ON usertoportfolio.portfolio_id = wallet.portfolio_id WHERE user_id = $1",
      [userId]
    );
    console.log(userSPortfolios[0].portfolio_id);
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
