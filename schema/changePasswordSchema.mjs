import Joi from 'joi';

const changePassword = Joi.object({
    email: Joi.string().optional(),
    oldpassword: Joi.string().optional(), 
    newpassword: Joi.string()
        .min(8)
        .pattern(/[A-Z]/, "one uppercase letter")
        .pattern(/[a-z]/, "one lowercase letter")
        .pattern(/\d/, "one number")
        .pattern(/[!@#$%^&*(),.?":{}|<>]/, "one special character")
        .required()
        .messages({
            "string.min": "Password must be at least 8 characters",
            "string.pattern.name": "Password must contain at least {#name}"
        }),
})

export default changePassword