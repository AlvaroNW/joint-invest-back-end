import pool from "../DB/client.js";

const createPortfolio = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { initial_amount, name_of_portfolio, friend_username } = req.body;

    if (!initial_amount || !name_of_portfolio || !friend_username) {
      throw Error();
    }

    //check if friend is in the database
    const { rows: findFriend } = await pool.query(
      "SELECT COUNT(username) AS number_of_friends FROM users WHERE username=$1",
      [friend_username]
    );
    let numberOfFriend = parseInt(findFriend[0].number_of_friends);

    if (numberOfFriend === 0) {
      res.json("user not found");
      throw new Error();
    }

    //if usernameId = friendId then it should not be possible to create a portfolio
    const { rows: findUsernameId } = await pool.query(
      "SELECT id FROM users WHERE username=$1",
      [friend_username]
    );
    let usernameId = parseInt(findUsernameId[0].id);
    let userIdInt = parseInt(userId);

    if (userIdInt === usernameId) {
      res.json("identical ids");
      throw new Error();
    } else {
      res.json("else is working");
    }

    //   creation of a new portfolio
    const { rows: newPortfolio } = await pool.query(
      "INSERT INTO Portfolio (initial_amount, portfolio_activate, name_of_portfolio, invested_amount,available_amount) VALUES ($1, false, $2, 0, $1)",
      [initial_amount, name_of_portfolio]
    );

    //look for portfolio and save id in a variable
    const { rows: findPortfolio } = await pool.query(
      "SELECT id FROM portfolio WHERE name_of_portfolio = $1 ORDER BY date_created DESC LIMIT 1",
      [name_of_portfolio]
    );
    const newPortfolioId = findPortfolio[0].id;

    //Create usertoportfolio relationship for user
    const { rows: newUsertoportfolioForUser } = await pool.query(
      "INSERT INTO usertoportfolio (user_id, portfolio_id) VALUES ($1, $2);",
      [userId, newPortfolioId]
    );

    //find friend id and save it in a variable
    const { rows: findFriendid } = await pool.query(
      "SELECT id FROM users WHERE username=$1",
      [friend_username]
    );
    const friendId = findFriendid[0].id;

    //Create usertoportfolio relationship for friend
    const { rows: newUsertoportfolioForFriend } = await pool.query(
      "INSERT INTO usertoportfolio (user_id, portfolio_id) VALUES ($1, $2);",
      [friendId, newPortfolioId]
    );

    console.log();
    return res.json({
      newPortfolio,
      newUsertoportfolioForUser,
      newUsertoportfolioForFriend,
    });
  } catch (e) {
    next({ message: e.message });
  }
};

export { createPortfolio };
