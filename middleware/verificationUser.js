import jwt from "jsonwebtoken";
import pool from "../DB/client.js";

const verifyToken = async (req, res, next) => {
  try {
    const {
      headers: { authorization },
    } = req;
    if (!authorization) return next("please login");
    const token = authorization.split(" ")[1];
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const myQuery = "SELECT * FROM Users WHERE id = $1";
    const { rows: user } = await pool.query(myQuery, [id]);
    req.user = user;
    next();
  } catch (e) {
    return next(e.message);
  }
};
export default verifyToken;
