const express = require("express");
const router = express.Router();

const ProductController = require('../Controllers/products');
const checkAuth = require('../Middlewares/check_auth');
const upload = require('../Middlewares/upload_file');

router.get("/", ProductController.GetAllProducts);

router.get("/:productId", ProductController.GetProductById);

router.post("/", checkAuth, upload.single('productImage'), ProductController.CreateProduct);

router.put('/:productId', checkAuth, ProductController.UpdateProduct);

router.delete('/:productId', checkAuth, ProductController.DeleteProduct);

module.exports = router;