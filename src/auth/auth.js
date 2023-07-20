let jwt = require("jsonwebtoken");

let checkJWT = function (req, res, next) {
  // read the auth  value from the header
  let value = req.get("Authorization");
  let signedToken;

  //pull out the jwt token from the value of the header
  if (value) {
    let parts = value.split(" ");
    if (parts[0] == "Bearer" && parts[1]) {
      signedToken = parts[1];
    }
  }

  //try to verify the token
  try {
    let token = jwt.verify(signedToken, process.env.JWT_SECRET);
    // means we have a good token, so call the next function in the chain

    req.userinfo = token;

    next();
  } catch (err) {
    console.log("Failed to verify jwt", err);
    res.sendStatus(401);
  }
};

module.exports = {
  checkJWT,
};