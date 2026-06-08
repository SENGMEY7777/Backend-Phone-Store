const Joi = require('joi');

const orderSchema = Joi.object({
    order_type: Joi.string()
        .trim()
        .uppercase()
        .valid('ORDER')
        .required()
        .messages({
            'any.only': 'Order type must be ORDER',
            'any.required': 'Order type is required'
        }),

    items: Joi.array()
        .items(
            Joi.object({
                product_id: Joi.number()
                    .integer()
                    .positive()
                    .required(),

                quantity: Joi.number()
                    .integer()
                    .min(1)
                    .max(1000)
                    .required()
            }).unknown(false) 
        )
        .min(1)
        .max(100)
        .required()
}).unknown(false);

module.exports = orderSchema;