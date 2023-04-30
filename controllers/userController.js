import pool from "../DB/client.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const saltRounds = Number(process.env?.SALT_ROUNDS) || 12;

const signUpUser = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    const hash = await bcrypt.hash(password, saltRounds);
    const myQuery =
      "INSERT INTO Users (email, password, username) VALUES ($1, $2, $3)";
    const { rows: newUser } = await pool.query(myQuery, [
      email,
      hash,
      username,
    ]);
    const myNewQuery = "SELECT * FROM Users WHERE email = $1";
    const { rows: theInfo } = await pool.query(myNewQuery, [email]);

    const token = jwt.sign({ id: theInfo[0].id }, process.env.JWT_SECRET);
    return res.status(201).send({ token: token, user_id: theInfo[0].id });
  } catch (e) {
    next(e.message);
  }
};

const signInUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const myQuery = "SELECT * FROM Users WHERE email = $1";
    const { rows: user } = await pool.query(myQuery, [email]);
    const match = await bcrypt.compare(password, user[0].password);
    if (!match) return next({ message: "Wrong password" });
    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET);
    return res.status(201).send({ token: token, user_id: user[0].id });
  } catch (e) {
    next(e.message);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const myQuery = "SELECT * FROM Users";
    const { rows: users } = await pool.query(myQuery);
    res.json(users);
  } catch (e) {
    next(e.message);
  }
};

const getOneUser = (req, res) => {
  console.log(req.user);
  res.json(req.user);
};

export { signUpUser, signInUser, getOneUser, getUsers };
