const Joi = require('joi');

const authSchema = Joi.object({
  email: Joi.string()
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid email format',
      'any.required': 'Email is required'
    }),

  password_hash: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required'
    })
});

module.exports = authSchema;