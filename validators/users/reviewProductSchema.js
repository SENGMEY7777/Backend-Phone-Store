const Joi = require('joi');

const reviewSchema = Joi.object({
    product_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Product ID must be a number',
            'number.integer': 'Product ID must be an integer',
            'number.positive': 'Product ID must be positive'
        }),

    rating: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required()
        .messages({
            'number.min': 'Rating must be between 1 and 5',
            'number.max': 'Rating must be between 1 and 5'
        }),

    review_text: Joi.string()
        .trim()
        .min(3)
        .max(1000)
        .pattern(/^(?!.*<script\b)(?!.*javascript:)[\s\S]*$/i)
        .required()
        .messages({
            'string.min': 'Review must be at least 3 characters',
            'string.max': 'Review cannot exceed 1000 characters',
            'string.pattern.base': 'Review contains forbidden content'
        })
})
.unknown(false);

module.exports = reviewSchema;