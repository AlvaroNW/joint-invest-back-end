import pool from "../DB/client.js";

const getOrders = async (req, res, next) => {
  try {
    const { portfolio_id } = req.params;
    const user_id = 1;

    const doneTransactions =
      "SELECT * FROM Transactions WHERE status = 'confirmed' AND portfolio_id = $1 ORDER BY creating_date DESC";
    const { rows: transactionList } = await pool.query(doneTransactions, [
      portfolio_id,
    ]);

    res.json(transactionList);
  } catch (e) {
    next({ message: e.message });
  }
};

export { getOrders };
