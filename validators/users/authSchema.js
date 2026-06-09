const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    email: Joi.string()
        .trim()
        .lowercase()
        .max(254)
        .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{3}$/)
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.pattern.base': 'Invalid email format',
            'string.max': 'Email must not exceed 254 characters'
        }),

    password_hash: Joi.string()
        .min(8)
        .max(128)
        .pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]).+$/
        )
        .required()
});

const resetPassword = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .max(254)
        .pattern(
            /^(?!.*\.\.)([a-zA-Z0-9._%+-]{1,64})@([a-zA-Z0-9-]+\.)+[A-Za-z]{2,}$/
        )
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.pattern.base': 'Invalid email format',
            'string.max': 'Email must not exceed 254 characters',
            'any.required': 'Email is required'
        })
});


const verifyOtpSchema = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .max(254)
        .pattern(
            /^(?!.*\.\.)([a-zA-Z0-9._%+-]{1,64})@([a-zA-Z0-9-]+\.)+[A-Za-z]{2,}$/
        )
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.pattern.base': 'Invalid email format',
            'any.required': 'Email is required'
        }),

    otp: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
            'string.empty': 'OTP is required',
            'string.length': 'OTP must be 6 digits',
            'string.pattern.base': 'OTP must contain only numbers',
            'any.required': 'OTP is required'
        })
});

const resetPasswordSchema = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .max(254)
        .pattern(
            /^(?!.*\.\.)([a-zA-Z0-9._%+-]{1,64})@([a-zA-Z0-9-]+\.)+[A-Za-z]{2,}$/
        )
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.pattern.base': 'Invalid email format',
            'any.required': 'Email is required'
        }),

    otp: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
            'string.empty': 'OTP is required',
            'string.length': 'OTP must be 6 digits',
            'string.pattern.base': 'OTP must contain only numbers',
            'any.required': 'OTP is required'
        }),

    password_hash: Joi.string()
        .min(8)
        .max(128)
        .pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]).+$/
        )
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 8 characters long',
            'string.max': 'Password must not exceed 128 characters',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            'any.required': 'Password is required'
        })
});


module.exports = {
    userSchema,
    resetPassword,
    verifyOtpSchema,
    resetPasswordSchema
}