import pool from "../DB/client.js";
import validator from "validator";

const checkEmptyTransactionPost = (req, res, next) => {
  const {
    number_of_shares,
    company_id,
    type_of_transaction,
    company_name,
    price_of_share,
    user_id,
  } = req.body;
  if (
    !number_of_shares ||
    !company_id ||
    !type_of_transaction ||
    !company_name ||
    !price_of_share ||
    !user_id
  )
    return next({ message: "Missing data" });
  return next();
};

const validateTransactionInput = (req, res, next) => {
  const {
    number_of_shares,
    company_id,
    type_of_transaction,
    company_name,
    price_of_share,
  } = req.body;
  const validInt = validator.isInt(number_of_shares);
  if (!validInt) return next({ message: "number_of_shares integer required" });
  const validCompanyId = validator.isAlphanumeric(company_id);
  if (!validCompanyId)
    return next({ message: "company_id only alphanumeric input allowed" });
  const validTypeOfTransaction = validator.isIn(type_of_transaction, [
    "Buy",
    "Sell",
  ]);
  if (!validTypeOfTransaction)
    return next({ message: "type_of_transaction input must be Buy or Sell" });
  const validCompanyName = validator.isAscii(company_name, ["Buy", "Sell"]);
  if (!validCompanyName) return next({ message: "company_name input must be" });
  const validPrice = validator.isFloat(price_of_share);
  if (!validPrice) return next({ message: "price_of_share float required" });

  return next();
};

const findOneTransaction = async (req, res, next) => {
  try {
    const { transaction_id, portfolio_id } = req.params;
    const findQuery =
      "SELECT * FROM Transactions WHERE portfolio_id = $1 AND id = $2";
    const { rows: transactionFound } = await pool.query(findQuery, [
      portfolio_id,
      transaction_id,
    ]);
    if (transactionFound.length == 0)
      return next({ message: "transaction not found" });
    return next();
  } catch (e) {
    next(e.message);
  }
};

// const findMatchingPortfolio = async (req, res, next) => {
//   try {
//     const { portfolio_id } = req.params;
//     const findQuery = "SELECT * FROM Transactions WHERE portfolio_id = $1";
//     const { rows: portfolioFound } = await pool.query(findQuery, [
//       portfolio_id,
//     ]);
//     if (portfolioFound.length == 0)
//       return next({ message: "portfolio not found" });
//     return next();
//   } catch (e) {
//     console.log(e);
//     next(e.message);
//   }
// };
const enoughMoneyPost = async (req, res, next) => {
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
    if (type_of_transaction == "Sell") return next();
    const seePortfolio = "SELECT * FROM Portfolio WHERE id = $1";
    const { rows: portfolioData } = await pool.query(seePortfolio, [
      portfolio_id,
    ]);
    const checkMoney =
      portfolioData[0].available_amount - price_of_share * number_of_shares;
    if (checkMoney < 0) return next({ message: "Not enough money left" });
    return next();
  } catch (e) {
    next(e.message);
  }
};

const enoughMoneyPut = async (req, res, next) => {
  try {
    const { portfolio_id, transaction_id } = req.params;
    const { transaction_status, current_price_of_share } = req.body;

    const seeTransaction = "SELECT * FROM Transactions WHERE id = $1";
    const { rows: transactionData } = await pool.query(seeTransaction, [
      transaction_id,
    ]);
    if (transactionData[0].type_of_transaction == "Sell") return next();

    const seePortfolio = "SELECT * FROM Portfolio WHERE id = $1";
    const { rows: portfolioData } = await pool.query(seePortfolio, [
      portfolio_id,
    ]);
    const checkMoney =
      portfolioData[0].available_amount -
      current_price_of_share * transactionData[0].number_of_shares;

    if (checkMoney < 0) return next({ message: "Not enough money left" });
    return next();
  } catch (e) {
    next(e.message);
  }
};

export {
  checkEmptyTransactionPost,
  validateTransactionInput,
  findOneTransaction,
  // findMatchingPortfolio,
  enoughMoneyPost,
  enoughMoneyPut,
};
