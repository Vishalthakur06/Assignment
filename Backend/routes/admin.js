const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth");

router.use(auth.authenticate, auth.isAdmin);

router.post(
  "/products",
  adminController.uploadProductImage,
  adminController.addProduct
);
router.post("/generate-codes", adminController.generateUniqueCodes);
router.get("/products", adminController.getAllProducts);

module.exports = router;
