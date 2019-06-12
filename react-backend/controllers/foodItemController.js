const FoodItem = require('../models/FoodItem');
var async = require('async');

// Handle foodItem create on POST.
exports.fooditem_create_post = [
    (req, res, next) => {
        console.log(req.body);

        let instance = new FoodItem({
            code: req.body.code,
            product_name: req.body.product_name,
            generic_name: req.body.generic_name,
            region: req.body.region,
            quantity: req.body.quantity
        });

        instance.save(function (err) {
            if (err) {
                console.log(err);
                return next(err);
            }
            console.log("good");
            // saved!
        });
    }
];