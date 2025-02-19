import Joi from "joi";

const addAvailabilitySchema = Joi.object({
    doctor_id: Joi.number()
        .integer()
        .required()
        .messages({
            "number.base": "Doctor ID must be a number.",
            "number.integer": "Doctor ID must be an integer.",
            "any.required": "Doctor ID is required."
        }),
    date: Joi.date()
        .iso()
        .required()
        .messages({
            "date.base": "Date must be a valid date.",
            "date.format": "Date must be in ISO format (YYYY-MM-DD).",
            "any.required": "Date is required."
        }),
    session: Joi.string()
        .required()
        .messages({
            "string.base": "Session must be a string.",
            "any.required": "Session is required."
        }),
     start_time: Joi.string()
            .pattern(/^([0-9]{1,2}):([0-9]{2}) (am|pm)$/i)
            .required()
            .messages({
                "any.required": "Start time is required.",
                "string.pattern.base": "Start time must be in 'hh:mm am/pm' format."
            }),
        end_time: Joi.string()
            .pattern(/^([0-9]{1,2}):([0-9]{2}) (am|pm)$/i)
            .required()
            .messages({
                "any.required": "End time is required.",
                "string.pattern.base": "End time must be in 'hh:mm am/pm' format."
            }),   
    slot_interval: Joi.number()
        .integer()
        .min(10)
        .max(60)
        .required()
        .messages({
            "number.base": "Slot interval must be a number.",
            "number.integer": "Slot interval must be an integer.",
            "number.min": "Slot interval must be at least 10 minutes.",
            "number.max": "Slot interval cannot be more than 60 minutes.",
            "any.required": "Slot interval is required."
        })
});


export default addAvailabilitySchema;
