const express = require("express");
const router = express.Router();
const controller = require("./controller");
const middleware = require("./auth/auth");

// Authentication routes
router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);

// User usability routes (gamejot routes)
// Lists all Logs/Gamejots
// router.get("/gamejots", middleware.checkJWT, controller.listEntries);
router.get("/gamejots", controller.listEntries);

// Lists One Gamejot by id
router.get("/gamejots/:id", middleware.checkJWT, controller.getEntry);

// Logs a Gamejot!
router.post("/gamejots", middleware.checkJWT, controller.addEntry);

// Updates a Gamejot!
router.put("/gamejots/:id", middleware.checkJWT, controller.updateEntry);

// Deletes a Gamejot!
router.delete("/gamejots/:id", middleware.checkJWT, controller.deleteEntry);

// Route to fetch posts for a specific user
router.get("/user/posts", middleware.checkJWT, controller.getEntriesByUserId);

module.exports = router;
