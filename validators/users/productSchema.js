const Joi = require('joi');

const productSchema = Joi.object({
    brand_id: Joi.number()
        .integer()
        .positive()
        .required(),

    name: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .pattern(/^[a-zA-Z0-9\s\-_.()]+$/)
        .required()
        .messages({
            'string.pattern.base':
                'Name contains invalid characters'
        }),

    description: Joi.string()
        .trim()
        .min(10)
        .max(2000)
        .pattern(/^[\w\s\-.,()!&%'":;\/]+$/)
        .required(),

    price: Joi.number()
        .precision(2)
        .positive()
        .max(9999999.99)
        .required(),

    stock_quantity: Joi.number()
        .integer()
        .min(0)
        .max(100000)
        .required(),

    preorder_available: Joi.boolean()
        .required(),

    preorder_release_date: Joi.date()
        .iso()
        .allow(null),

    image_url: Joi.string()
        .trim()
        .uri({
            scheme: ['https']
        })
        .max(2048)
        .required(),

    is_active: Joi.boolean()
        .required()

}).unknown(false);

module.exports = productSchema;