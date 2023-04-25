import pool from "../DB/client.js";

const getTransactions = async (req, res, next) => {
  try {
    const { portfolio_id } = req.params;

    const getStocksDisplay =
      "SELECT * FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY company_id ORDER BY creating_date DESC) AS rn FROM Transactions) t WHERE rn = 1 AND portfolio_id = $1 ORDER BY creating_date DESC";
    const { rows: newQuery } = await pool.query(getStocksDisplay, [
      portfolio_id,
    ]);
    res.json(newQuery);
  } catch (e) {
    res.json({ error: e.message });
  }
};

const postTransaction = async (req, res, next) => {
  try {
    const { portfolio_id } = req.params;
    const {
      number_of_shares,
      company_id,
      type_of_transaction,
      company_name,
      price_of_share,
      user_id,
    } = req.body;
    const user = 1;

    const queryInsert =
      "INSERT INTO Transactions (portfolio_id, number_of_shares, company_id, type_of_transaction, company_name, price_of_share, user_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') RETURNING *;";
    const { rows: newTransaction } = await pool.query(queryInsert, [
      portfolio_id,
      number_of_shares,
      company_id,
      type_of_transaction,
      company_name,
      price_of_share,
      user_id,
    ]);
    res.status(201).json(newTransaction);
  } catch (e) {
    res.json({ error: e.message });
  }
};

const putTransaction = async (req, res, next) => {
  try {
    const { portfolio_id, transaction_id } = req.params;
    const { transaction_status, current_price_of_share } = req.body;
    const user = 1;
    if (transaction_status == "canceled") {
      const queryUpdate =
        "UPDATE Transactions SET status = 'canceled' WHERE id = $1 AND portfolio_id = $2 RETURNING *";
      const { rows: updatedRow } = await pool.query(queryUpdate, [
        transaction_id,
        portfolio_id,
      ]);
      res.status(200).json(updatedRow);
    }
    if (transaction_status == "confirmed") {
      const callQuery = "SELECT * FROM Portfolio WHERE id = $1";
      const { rows: myUpdates } = await pool.query(callQuery, [portfolio_id]);
      const {
        type_of_transaction: buyOrSell,
        number_of_shares: amountBuyOrSell,
      } = myUpdates;

      const newAmount = amountBuyOrSell * current_price_of_share;
      const writeToPortfolio = "SELECT * FROM Portfolio WHERE id = $1";
      const { rows: getPortfolio } = await pool.query(writeToPortfolio, [
        portfolio_id,
      ]);
      const { invested_amount: invAmount, available_amount: availAmount } =
        getPortfolio;

      if (buyOrSell == "Buy") {
        const newInvestedAmount = invAmount + newAmount;
        const newAvailableAmount = availAmount - newAmount;
        const portfolioQuery =
          "UPDATE Portfolio SET invested_amount = $1, available_amount = $2 WHERE id = $3 RETURNING *";
        await pool.query(portfolioQuery, [
          newInvestedAmount,
          newAvailableAmount,
          portfolio_id,
        ]);
      } else {
        const newInvestedAmount = invAmount - newAmount;
        const newAvailableAmount = availAmount + newAmount;
        const portfolioQuery =
          "UPDATE Portfolio SET invested_amount = $1, available_amount = $2 WHERE id = $3 RETURNING *";
        await pool.query(portfolioQuery, [
          newInvestedAmount,
          newAvailableAmount,
          portfolio_id,
        ]);
      }
      const checkPortfolio = "SELECT * FROM Portfolio WHERE id = $1";
      const { rows: showPortfolio } = await pool.query(checkPortfolio, [
        portfolio_id,
      ]);

      const queryUpdate =
        "UPDATE Transactions SET status = 'confirmed', price_of_share = $1 WHERE id = $2 AND portfolio_id = $3 RETURNING *";
      const { rows: updatedRow } = await pool.query(queryUpdate, [
        current_price_of_share,
        transaction_id,
        portfolio_id,
      ]);

      res.status(200).json({
        portfolio_change: showPortfolio,
        transaction_change: updatedRow,
      });
    }
  } catch (e) {
    res.json({ error: e.message });
  }
};

export { postTransaction, putTransaction, getTransactions };
