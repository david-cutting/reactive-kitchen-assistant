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

// Virtual for food's JSON lookup URL
FoodItem
    .virtual('url-json')
    .get(function () {
        if(this.region != null) {   // If we can localize it it *might* save us some time
            return 'https://' + this.region + '.openfoodfacts.org/api/v0/product/' + this.code + '.json';
        }
        return 'https://world.openfoodfacts.org/api/v0/product/' + this.code + '.json';
    });

//Export model
module.exports = mongoose.model('FoodItem', FoodItem);