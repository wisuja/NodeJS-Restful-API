const express = require("express");
const router = express.Router();

const mongoose = require("../Config/database");
const Product = require("../Models/Product");

router.get("/", (req, res) => {
  Product
    .find()
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        count: result.length,
        products: result.map(res => {
          return {
            id: res._id,
            name: res.name,
            price: res.price,
            request: {
              type: 'GET',
              description: 'Get product detail with the given ID',
              url: 'http://localhost:3000/products/' + res._id
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

router.get("/:productId", (req, res) => {
  const id = req.params.productId;
  Product
    .findById({
      _id: id
    })
    .exec()
    .then(result => {
      if (!result) {
        res.status(404).json({
          message: 'Product not found'
        });
      };

      console.log(result);
      res.status(200).json({
        product: {
          id: result._id,
          name: result.name,
          price: result.price,
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
  if (isNaN(req.body.price)) {
    return res.status(404).json({
      message: 'Please input numbers only for price column'
    });
  };

  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });

  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Product created successfully',
        createdProduct: {
          id: result._id,
          name: result.name,
          price: result.price,
          request: {
            type: 'GET',
            description: 'Get product detail with the given ID',
            url: 'http://localhost:3000/products/' + result._id
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