const express = require('express');
const morgan = require('morgan');
const app = express();

const productRoutes = require('./Routes/products');
const orderRoutes = require('./Routes/orders');
const userRoutes = require('./Routes/users');

// Static
app.use('/uploads', express.static("./public/uploads/"));

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

// CORS Handling
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origins', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method == 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return res.status(200).json({});
  }

  next();
});

// Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

// Error Handling
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  if (error) {
    console.log(error);
    res.status(error.status || 500).json({
      error: {
        message: error.message,
      },
    });
  }
});

module.exports = app;