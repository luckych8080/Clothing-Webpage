const Joi = require('joi');
const { number } = require('joi');

module.exports.productSchema = Joi.object({
    product: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        description: Joi.string().required(),
        size: Joi.string().required(),
        wash: Joi.string().required(),
        colour: Joi.string().required(),
        material: Joi.string().required(),
        category: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})
