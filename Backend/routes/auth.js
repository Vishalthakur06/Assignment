const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

module.exports = router;
router.post("/login", authController.login);
router.post("/logout", auth.authenticate, authController.logout);

module.exports = router;
