let db = require("./db");

let argon = require("argon2");

let jwt = require("jsonwebtoken");

//authentication
//accept user & pw
//store email & hash
let registerUser = async function (req, res) {
  // get username, email, and password from the request body
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  // make sure the username and email are truthy
  if (!username || !email || !password) {
    res.status(400).json({ error: "Username and email are required" });
    return;
  }

  // convert password to hash
  let hash;
  try {
    hash = await argon.hash(password);
  } catch (err) {
    console.log("Failed to hash password", err);
    res.sendStatus(500);
    return;
  }

  // insert the new user into the 'users' table
  let sql =
    "INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, ?);";
  let params = [username, email, hash, new Date()];

  db.query(sql, params, function (err, results) {
    if (err) {
      console.log("Failed to register user", err);
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  });
};

let loginUser = function (req, res) {
  // get email and password from the request body
  let email = req.body.email;
  let password = req.body.password;

  // query the user based on the provided email
  let sql = "SELECT user_id, password FROM users WHERE email = ?;";
  let params = [email];

  db.query(sql, params, async function (err, results) {
    let storedHash;
    let storedId;
    if (err) {
      console.log("Failed to fetch hash for user", err);
    } else if (results.length > 1) {
      console.log("Returned more than 1 user for the email", email);
    } else if (results.length == 1) {
      storedHash = results[0].password;
      storedId = results[0].user_id;
    } else if (results.length == 0) {
      console.log("Did not find a user for email", email);
    }

    try {
      let pass = await argon.verify(storedHash, password);
      if (pass) {
        // (new) we will generate a token and send it back
        let token = {
          id: storedId,
          email: email,
        };

        //token is good for 24hrs 86400 seconds
        let signedToken = jwt.sign(token, process.env.JWT_SECRET, {
          expiresIn: 86400,
        });
        res.json(signedToken);
      } else {
        res.sendStatus(401);
      }
    } catch (err) {
      console.log("Failed when verifying the hash", err);
      res.sendStatus(401);
    }
  });
};

//User usability
let listEntries = function (req, res) {
  //returns a summary of all entries in the database

  let sql = "select post_id, game_title, status from posts";

  db.query(sql, function (err, results) {
    if (err) {
      console.log("fail to query database", err);
      res.sendStatus(500);
    } else {
      res.json(results);
    }
  });
};

let getEntry = function (req, res) {
  //1. want to get id from req params
  //2. we want to exec the sql statement to get the info for an entry from db, but only for that id

  let id = req.params.post_id;

  let sql = "select * from posts where post_id = ?";
  let params = [id];

  db.query(sql, params, function (err, results) {
    if (err) {
      console.log("fail to query database", err);
      res.sendStatus(500);
    } else {
      if (results.length == 0) {
        res.sendStatus(404);
      } else {
        res.json(results[0]);
      }
    }
  });
};

let deleteEntry = function (req, res) {
  // want to accept a id from the req
  // we will delete a row with matching id

  let id = req.params.post_id;

  let sql = "delete from posts where post_id = ?";
  let params = [id];

  db.query(sql, params, function (err, results) {
    if (err) {
      console.log("delete query failed", err);
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  });
};

let addEntry = function (req, res) {
  // read some data from request
  // execute the query that will insert data into the database

  let gameTitle = req.body.game_title;
  let gameYear = req.body.game_year;
  let gameDev = req.body.game_dev;
  let status = req.body.status;

  const validStatusValues = ["completed", "started", "watchlist"];
  if (!validStatusValues.includes(status)) {
    return res.status(400).json({
      error:
        "Invalid status value. It must be one of: completed, started, watchlist",
    });
  }

  let sql =
    "insert into posts (game_title, game_year, game_dev, status, created_at, post_id) values (?, ?, ?, ?, ?, ?);";
  let params = [gameTitle, gameYear, gameDev, status, new Date()];

  db.query(sql, params, function (err, results) {
    if (err) {
      console.log("Failed to insert into database", err);
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  });
};

let updateEntry = function (req, res) {
  // get the id from the req path param (like del, get)
  // we will get the rest of the info from the req body (like the post)

  let id = req.params.post_id;
  let gameTitle = req.body.game_title;
  let gameYear = req.body.game_year;
  let gameDev = req.body.game_dev;
  let status = req.body.status;

  const validStatusValues = ["completed", "started", "watchlist"];
  if (!validStatusValues.includes(status)) {
    return res.status(400).json({
      error:
        "Invalid status value. It must be one of: completed, started, watchlist",
    });
  }

  if (!gameTitle) {
    return res.status(400).json({ error: "game_title is required" });
  }

  let sql =
    "UPDATE posts SET game_title=?, game_year=?, game_dev=?, status=? WHERE post_id=?;";
  let params = [id, gameTitle, gameYear, gameDev, status];

  db.query(sql, params, function (err, results) {
    if (err) {
      console.log("Failed to update database", err);
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  });
};

module.exports = {
  registerUser,
  loginUser,
  listEntries,
  getEntry,
  deleteEntry,
  addEntry,
  updateEntry,
};
