const FoodItemInstance = require('../models/FoodItemInstance');

// Handle foodItem create on POST.
exports.fooditem_create_post = [
    (req, res, next) => {
        console.log('Scanned code: ' + req.body.code);

        let instance = new FoodItemInstance({
            food_item: { type: Schema.Types.ObjectId, ref: 'FoodItem', required: 'True' },
            scan_datetime: { type: String, required: true, max: 50 },
            expiration_datetime: { type: String, required: false, max: 50 },
            quantity: { type: Number, required: true, min: 0 }
        });

        instance.save(function (err) {
            if (err) {
                console.log(err);
                return next(err);
            }
            // saved!
        });
    }
];

