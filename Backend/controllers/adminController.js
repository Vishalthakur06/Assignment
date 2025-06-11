const { v4: uuidv4 } = require("uuid");
const Product = require("../models/Product");
const UniqueCode = require("../models/UniqueCode");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).single("image");

exports.uploadProductImage = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: "Image upload failed" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }
    req.imageUrl = req.file.path;
    next();
  });
};

//adding product by admin
exports.addProduct = async (req, res) => {
  try {
    const { name, batchSize, mrp } = req.body;

    const product = new Product({
      name,
      batchSize,
      mrp,
      imageUrl: req.imageUrl,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Error adding product" });
  }
};

//generating unique codes
exports.generateUniqueCodes = async (req, res) => {
  try {
    const { productId, batchNumber } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const codes = [];
    for (let i = 0; i < product.batchSize; i++) {
      codes.push({
        code: uuidv4(),
        productId,
        batchNumber,
      });
    }

    await UniqueCode.insertMany(codes);

    res.status(201).json({
      message: `${product.batchSize} unique codes generated for batch ${batchNumber}`,
      codes,
    });
  } catch (error) {
    res.status(500).json({ error: "Error generating unique codes" });
  }
};

//get all product
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
};
