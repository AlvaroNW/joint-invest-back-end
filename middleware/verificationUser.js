import jwt from "jsonwebtoken";
import pool from "../DB/client.js";
import { cryptoCache } from "../middleware/cache.js";

const verifyToken = async (req, res, next) => {
  try {
    const {
      headers: { authorization },
    } = req;
    if (!authorization) return next("please login");
    const token = authorization.split(" ")[1];
    console.log(token);
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    console.log(id);

    if (cryptoCache.has(id.toString)) {
      console.log("using manual cache!");
      req.user = cryptoCache.get(id.toString());
      next();
    }
    const myQuery = "SELECT * FROM Users WHERE id = $1";
    const { rows: user } = await pool.query(myQuery, [id]);
    console.log("using DB call!");
    cryptoCache.set(id.toString(), user[0]);
    req.user = user[0];
    next();
  } catch (e) {
    return next(e.message);
  }
};
export default verifyToken;
