const UniqueCode = require("../models/UniqueCode");
const Product = require("../models/Product");

exports.searchByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const uniqueCode = await UniqueCode.findOne({ code }).populate("productId");
    if (!uniqueCode) {
      return res.status(404).json({ error: "Code not found" });
    }

    const product = await Product.findById(uniqueCode.productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      code: uniqueCode.code,
      batchNumber: uniqueCode.batchNumber,
      product: {
        name: product.name,
        mrp: product.mrp,
        imageUrl: product.imageUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error searching by code" });
  }
};
