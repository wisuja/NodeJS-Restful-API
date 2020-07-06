const mongoose = require("../Config/database");
const User = require('../Models/User');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.CreateUser = (req, res) => {
  User
    .findOne({
      email: req.body.email
    })
    .exec()
    .then(user => {
      if (user)
        return res.status(409).json({
          error: {
            message: 'Email already existed'
          }
        });

      bcrypt.hash(req.body.password, 10, (error, hash) => {
        if (error) {
          return res.status(500).json({
            error: {
              message: error.message
            }
          });
        };

        const user = new User({
          _id: mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash
        });

        user
          .save()
          .then(result => {
            console.log(result);
            res.status(201).json({
              message: 'User created'
            })
          })
          .catch(error => {
            res.status(500).json({
              error: {
                message: error.message
              }
            })
          })
      })
    })
};

exports.UserLogin = (req, res) => {
  User
    .find({
      email: req.body.email
    })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }

      bcrypt.compare(req.body.password, user[0].password, (error, result) => {
        if (error) {
          return res.status(401).json({
            message: 'Auth failed'
          });
        }

        if (result) {
          const token = jwt.sign({
            userId: user[0]._id,
            email: user[0].email
          }, process.env.JWT_SECRET, {
            expiresIn: "1h"
          })
          res.status(200).json({
            message: 'Auth success',
            token
          })
        } else {
          return res.status(401).json({
            message: 'Auth failed'
          });
        }
      })
    })
    .catch(error => {
      res.status(500).json({
        error: {
          message: error.message
        }
      })
    })
};

exports.DeleteUser = (req, res) => {
  User
    .remove({
      _id: req.params.userId
    })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: 'User deleted'
      })
    })
    .catch(error => {
      res.status(500).json({
        error: {
          message: error.message
        }
      })
    })
};