const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FoodItem = new Schema(
    {
        code: String,
        product_name: String,
        generic_name: String,
        region: String,
        quantity: String
    }
);

//Export model
module.exports = mongoose.model('FoodItem', FoodItem);