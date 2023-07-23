const express = require("express");
const router = express.Router();
const controller = require("./controller");
const middleware = require("./auth/auth");

// Authentication routes
router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);

// User usability routes (gamejot routes)
router.get("/gamejot", middleware.checkJWT, controller.listEntries);
router.get("/gamejot/:id", middleware.checkJWT, controller.getEntry);
router.post("/gamejot", middleware.checkJWT, controller.addEntry);
router.put("/gamejot/:id", middleware.checkJWT, controller.updateEntry);
router.delete("/gamejot/:id", middleware.checkJWT, controller.deleteEntry);

module.exports = router;
