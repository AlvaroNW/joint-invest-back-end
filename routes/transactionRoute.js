import { Router } from "express";
import {
  postTransaction,
  putTransaction,
  getTransactions,
} from "../controllers/transactionController.js";
import {
  checkEmptyTransactionPost,
  validateTransactionInput,
  findOneTransaction,
  findMatchingPortfolio,
  enoughMoneyPost,
  enoughMoneyPut,
} from "../middleware/validateTransaction.js";

const transactionRoute = Router();

transactionRoute
  .route("/:portfolio_id")
  .get(getTransactions)
  .post(
    checkEmptyTransactionPost,
    validateTransactionInput,
    findMatchingPortfolio,
    enoughMoneyPost,
    postTransaction
  );
transactionRoute
  .route("/:portfolio_id/:transaction_id")
  .put(findOneTransaction, enoughMoneyPut, putTransaction);

export default transactionRoute;
