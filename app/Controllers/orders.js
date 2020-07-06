const mongoose = require("../Config/database");
const Order = require('../Models/Order');
const Product = require('../Models/Product');

exports.GetAllOrders = (req, res) => {
  Order
    .find()
    .populate('product', '_id name price')
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
};

exports.GetOrderById = (req, res) => {
  const id = req.params.orderId;
  Order
    .findById(id)
    .populate('product', '_id name price')
    .exec()
    .then(result => {
      if (!result) {
        return res.status(404).json({
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
};

exports.CreateOrder = (req, res) => {
  Product
    .findById(req.body.productId)
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

      order
        .save()
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
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        error: {
          message: error.message
        }
      })
    })
};

exports.UpdateOrder = (req, res) => {
  const id = req.params.orderId;

  const updateOptions = {}

  for (let updateOpt of req.body) {
    updateOptions[updateOpt.propName] = updateOpt.value;
  }

  Order
    .updateOne({
      _id: id
    }, {
      $set: updateOptions
    })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Order updated successfully',
        request: {
          type: 'GET',
          description: 'Get order detail with the given ID',
          url: 'http://localhost:3000/orders/' + id
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
};

exports.DeleteOrder = (req, res) => {
  const id = req.params.orderId;

  Order
    .remove({
      _id: id
    })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Order deleted successfully',
        request: {
          type: 'GET',
          description: 'Get all orders entries',
          url: 'http://localhost:3000/orders'
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
};