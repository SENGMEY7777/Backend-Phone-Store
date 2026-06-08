const Joi = require('joi');

const stockMovementSchema = Joi.object({
    product_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Product ID must be a number',
            'number.integer': 'Product ID must be an integer',
            'number.positive': 'Product ID must be positive',
            'any.required': 'Product ID is required'
        }),

    action_type: Joi.string()
        .valid('ADD', 'REMOVE')
        .required()
        .messages({
            'any.only': 'Action type must be ADD or REMOVE',
            'any.required': 'Action type is required'
        }),

    quantity_changed: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'number.base': 'Quantity must be a number',
            'number.integer': 'Quantity must be an integer',
            'number.min': 'Quantity must be at least 1',
            'any.required': 'Quantity is required'
        })
});

module.exports = stockMovementSchema;