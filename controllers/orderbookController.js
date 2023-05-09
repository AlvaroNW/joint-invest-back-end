import pool from "../DB/client.js";
import { cryptoCache } from "../middleware/cache.js";

const getOrders = async (req, res, next) => {
  try {
    const { portfolio_id } = req.params;

    // if (cryptoCache.has(`orderBook_${portfolio_id}`)) {
    //   console.log("use manual cache! ---> getOderBook");
    //   return res.json(cryptoCache.get(`orderBook_${portfolio_id}`));
    // }
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
    // console.log("use db call! ---> getOderBook");
    // cryptoCache.set(`orderBook_${portfolio_id}`, transactionList);
    return res.json(transactionList);
  } catch (e) {
    next({ message: e.message });
  }
};

export { getOrders };
