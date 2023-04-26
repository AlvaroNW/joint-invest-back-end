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
    return next("Missing data");
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
  if (!validInt) return next("number_of_shares integer required");
  const validCompanyId = validator.isAlphanumeric(company_id);
  if (!validCompanyId)
    return next("company_id only alphanumeric input allowed");
  const validTypeOfTransaction = validator.isIn(type_of_transaction, [
    "Buy",
    "Sell",
  ]);
  if (!validTypeOfTransaction)
    return next("type_of_transaction input must be Buy or Sell");
  const validCompanyName = validator.isAscii(company_name, ["Buy", "Sell"]);
  if (!validCompanyName) return next("company_name input must be");
  const validPrice = validator.isFloat(price_of_share);
  if (!validPrice) return next("price_of_share float required");

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
    if (transactionFound.length == 0) return next("transaction not found");
    return next();
  } catch (e) {
    console.log(e);
    next(e.message);
  }
};

const findMatchingPortfolio = async (req, res, next) => {
  try {
    const { portfolio_id } = req.params;
    const findQuery = "SELECT * FROM Transactions WHERE portfolio_id = $1";
    const { rows: portfolioFound } = await pool.query(findQuery, [
      portfolio_id,
    ]);
    if (portfolioFound.length == 0) return next("portfolio not found");
    return next();
  } catch (e) {
    console.log(e);
    next(e.message);
  }
};

export {
  checkEmptyTransactionPost,
  validateTransactionInput,
  findOneTransaction,
  findMatchingPortfolio,
};
