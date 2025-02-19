import Joi from "joi";

const slotAvailabilitySchema = Joi.object({
    patient_id: Joi.number()
        .integer()
        .required()
        .messages({
            "any.required": "Patient ID is required.",
            "number.base": "Patient ID must be a valid number.",
            "number.integer": "Patient ID must be an integer."
        }),
    doctor_id: Joi.number()
        .integer()
        .required()
        .messages({
            "any.required": "Doctor ID is required.",
            "number.base": "Doctor ID must be a valid number.",
            "number.integer": "Doctor ID must be an integer."
        }),
    session: Joi.string()
        .valid("Morning", "Afternoon")
        .required()
        .messages({
            "any.required": "Session is required.",
            "any.only": "Session must be 'Morning', 'Afternoon', or 'Evening'."
        }),
    date: Joi.date()
        .required()
        .messages({
            "any.required": "Date is required.",
            "date.base": "Date must be a valid date.",
            "date.format": "Date must be in ISO format (YYYY-MM-DD).",
            "date.greater": "Date must be in the future. Past dates are not allowed."
        })
});

export default slotAvailabilitySchema;
