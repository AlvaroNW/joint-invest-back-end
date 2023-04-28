import pool from "../DB/client.js";
import validator from "validator";

const checkEmptyUser = (req, res, next) => {
  const { email, username, password } = req.body;
  if (!username || !email || !password)
    return next({ message: "Missing Data!" });
  return next();
};

const checkEmptyLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next({ message: "Missing Data!" });
  return next();
};

const validateUserInput = (req, res, next) => {
  const { email, username, password } = req.body;
  const validEmail = validator.isEmail(email);
  if (!validEmail) return next({ message: "Invalid e-mail address!" });
  const validUsername = validator.isAlphanumeric(username);
  if (!validUsername)
    return next({ message: "Only alphanumeric username allowed!" });
  const validPassword = validator.isLength(password, { min: 8 });
  if (!validPassword)
    return next({ message: "Password needs min. 8 characters!" });
  return next();
};

const checkUniqueUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const myQuery = "SELECT * FROM Users WHERE email = $1";
    const { rows: user } = await pool.query(myQuery, [email]);
    if (user.length > 0) return next({ message: "Email already exists" });
    return next();
  } catch (e) {
    console.log(e);
    next(e.message);
  }
};

const findOneUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const myQuery = "SELECT * FROM Users WHERE email = $1";
    const { rows: user } = await pool.query(myQuery, [email]);
    if (user.length == 0) return next({ message: "User not registered" });
    return next();
  } catch (e) {
    next(e.message);
  }
};

export {
  checkEmptyUser,
  validateUserInput,
  checkUniqueUser,
  findOneUser,
  checkEmptyLogin,
};
