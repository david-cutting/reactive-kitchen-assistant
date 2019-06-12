const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FoodItemInstance = new Schema(
    {
        food_item: { type: Schema.Types.ObjectId, ref: 'FoodItem', required: 'True' },
        scan_datetime: { type: String, required: true, max: 50 },
        expiration_datetime: { type: String, required: false, max: 50 },
        quantity: { type: Number, required: true, min: 0 }
    }
);

// Virtual for food's expiration clock
FoodItemInstance
    .virtual('expiration-datetime')
    .get(function () {
        return (Date() - this.expiration_datetime);
    });

//Export model
module.exports = mongoose.model('FoodItem', FoodItemInstance);