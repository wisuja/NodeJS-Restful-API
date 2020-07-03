const express = require("express");
const router = express.Router();

const mongoose = require("../Config/database");
const Order = require('../Models/Order');
const Product = require('../Models/Product');

router.get("/", (req, res) => {
  Order
    .find()
    .populate('Product', '_id name price')
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        count: result.length,
        orders: result.map(res => {
          return {
            id: res._id,
            product: res.product,
            quantity: res.quantity,
            request: {
              type: 'GET',
              description: 'Get order detail with the given ID',
              url: 'http://localhost:3000/orders/' + res._id
            }
          }
        })
      })
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({
        error: {
          message: error.message
        }
      })
    });
});

router.get("/:orderId", (req, res) => {
  const id = req.params.orderId;
  Order
    .findById({
      _id: id
    })
    .populate('Product', '_id name price')
    .exec()
    .then(result => {
      if (!result) {
        res.status(404).json({
          message: 'Product not found'
        });
      };

      console.log(result);
      res.status(200).json({
        order: {
          id: result._id,
          product: result.product,
          quantity: result.quantity,
          request: {
            type: 'GET',
            description: 'Get all products entries',
            url: 'http://localhost:3000/products'
          }
        }
      })

    })
    .catch(error => {
      console.error(error);
      res.status(500).json({
        error: {
          message: error.message
        }
      })
    });
});

router.post("/", (req, res) => {
  Product
    .findById({
      _id: req.body.productId
    })
    .exec()
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          message: 'Product not found'
        });
      };

      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
      });

      return order.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: 'Order created successfully',
        createdOrder: {
          id: result._id,
          productId: result.product,
          quantity: result.quantity
        }
      })
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        error: {
          message: error.message
        }
      })
    })
});

router.put('/:productId', (req, res) => {
  const id = req.params.productId;

  const updateOptions = {}

  for (let updateOpt of req.body) {
    updateOptions[updateOpt.propName] = updateOpt.value;
  }

  Product
    .updateOne({
      _id: id
    }, {
      $set: updateOptions
    })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Product updated successfully',
        request: {
          type: 'GET',
          description: 'Get product detail with the given ID',
          url: 'http://localhost:3000/products/' + id
        }
      })
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({
        error: {
          message: error.message
        }
      })
    });
});

router.delete('/:productId', (req, res) => {
  const id = req.params.productId;

  Product
    .remove({
      _id: id
    })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Product deleted successfully',
        request: {
          type: 'GET',
          description: 'Get all products entries',
          url: 'http://localhost:3000/products'
        }
      })
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({
        error: {
          message: error.message
        }
      })
    })
})
module.exports = router;