const express = require("express");
const router = express.Router();

const OrderController = require('../Controllers/orders');
const checkAuth = require('../Middlewares/check_auth');

router.get("/", checkAuth, OrderController.GetAllOrders);

router.get("/:orderId", checkAuth, OrderController.GetOrderById);

router.post("/", checkAuth, OrderController.CreateOrder);

router.put('/:orderId', checkAuth, OrderController.UpdateOrder);

router.delete('/:orderId', checkAuth, OrderController.DeleteOrder);

module.exports = router;