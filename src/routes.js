let express = require("express");

let router = express.Router();

let controller = require("./controller");

//authentication
let Middleware = require("./auth/auth")

router.get("/users", Middleware.checkJWT, controller.listUsers)

router.post("/register", controller.registerUser);

router.post("/login", controller.loginUser);



module.exports = router;