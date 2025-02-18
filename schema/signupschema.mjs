import Joi from 'joi';


const signupschema = Joi.object({
    email: Joi.string()
        .email()
        .pattern(/^[^\s]*$/)
        .required()
        .messages({
            "string.base": `"email" should be a type of 'text'`,
            "string.email": `"email" should be a valid email`,
            "string.pattern.base": `"email" should not contain spaces`,
            "any.required": `"email" is required`
        }),
    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required()
        .messages({
            "string.base": `"password" should be a type of 'text'`,
            "string.min": `"password" should have a minimum length of {#limit}`,
            "string.pattern.base": `"password" must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character`,
            "any.required": `"password" is required`
        }),
        role:Joi.string().optional()
});



export { signupschema };

