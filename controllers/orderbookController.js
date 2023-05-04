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

    transactionList.map((stock) => {
      const num = stock.number_of_shares;
      const pric = stock.price_of_share;
      stock.buy_sell_value = `${num * pric}`;
    });

    res.json(transactionList);
  } catch (e) {
    next({ message: e.message });
  }
};

export { getOrders };
