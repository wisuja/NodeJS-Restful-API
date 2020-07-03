const mongoose = require('../Config/database');

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String, // For Indonesian Rupiahs
    required: true,
  },
});

module.exports = mongoose.model('Product', productSchema);