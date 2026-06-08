
const Joi = require('joi');

const brandSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 2 characters',
            'string.max': 'Name must not exceed 100 characters',
            'any.required': 'Name is required'
        }),

    description: Joi.string()
        .trim()
        .min(5)
        .max(500)
        .required()
        .messages({
            'string.empty': 'Description is required',
            'string.min': 'Description must be at least 5 characters',
            'string.max': 'Description must not exceed 500 characters',
            'any.required': 'Description is required'
        })
});

module.exports = {
    brandSchema
};