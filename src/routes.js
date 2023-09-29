const express = require("express");
const router = express.Router();
const controller = require("./controller");
const middleware = require("./auth/auth");

// Authentication routes
router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);

// User usability routes (gamejot routes)
// Lists all Logs/Gamejots

// router.get("/gamejot", middleware.checkJWT, controller.listEntries);
router.get("/gamejot", controller.listEntries);

// Lists One Gamejot by id
router.get("/gamejot/:id", middleware.checkJWT, controller.getEntry);

// Logs a Gamejot!
router.post("/gamejot", middleware.checkJWT, controller.addEntry);

// Updates a Gamejot!
router.put("/gamejot/:id", middleware.checkJWT, controller.updateEntry);

// Deletes a Gamejot!
router.delete("/gamejot/:id", middleware.checkJWT, controller.deleteEntry);

// Route to fetch posts for a specific user
router.get("/user/posts", middleware.checkJWT, controller.getUserPosts);

module.exports = router;