const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.use(auth.authenticate);

router.get("/search/:code", userController.searchByCode);

module.exports = router;
