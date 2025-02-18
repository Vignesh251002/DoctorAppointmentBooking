import Joi from 'joi';

const otpSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required"
    }),
    otp: Joi.string() 
        .length(6)
        .pattern(/^\d+$/)
        .required()
        .messages({
        "string.length": "OTP must be exactly 6 digits",
        "string.pattern.base": "OTP must contain only numbers",
        "any.required": "OTP is required"
    })
});


export default otpSchema