import pool from '../DB/client.js';

const getMessages = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const portfolioQuery =
      "SELECT utp.user_id AS user_id, p.user_id_status_request AS requester_id, u.username AS requester_name, p.request_creation_date AS date, utp.portfolio_id AS portfolio_id, p.name_of_portfolio AS portofolio_name, p.status AS action, p.initial_amount AS initial_amount FROM usertoportfolio utp LEFT JOIN portfolio p ON utp.portfolio_id = p.id LEFT JOIN users u ON p.user_id_status_request = u.id WHERE p.status LIKE '%pending%' AND utp.user_id = $1";

    const transactionsQuery =
      "SELECT t.user_id AS requester_id, u.username AS requester_name, t.creating_date AS date,t.portfolio_id AS portfolio_id,p.name_of_portfolio AS portfolio_name,t.status AS action, t.company_name AS company_name, t.number_of_shares AS number_of_shares FROM usertoportfolio utp  LEFT JOIN transactions t  ON utp.portfolio_id = t.portfolio_id  LEFT JOIN portfolio p ON utp.portfolio_id = p.id LEFT JOIN users u ON t.user_id = u.id WHERE t.status LIKE '%pending%' AND utp.user_id = $1";

    const { rows: portfoliosMessages } = await pool.query(
      portfolioQuery,
      [userId]
    );

    const { rows: transactionsMessages } = await pool.query(
      transactionsQuery,
      [userId]
    );

    return res.json({ portfoliosMessages, transactionsMessages });
  } catch (e) {
    next(e.message);
  }
};

export { getMessages };
