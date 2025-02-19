import Joi from "joi";

const appointmentBookingSchema = Joi.object({
    doctor_id: Joi.number()
        .required()
        .integer()
        .messages({
            "any.required": "Doctor ID is required.",
            "number.base": "Doctor ID must be a valid number.",
            "number.integer": "Doctor ID must be an integer."
        }),
    patient_id: Joi.number()
        .integer()
        .required()
        .messages({
            "any.required": "Patient ID is required.",
            "number.base": "Patient ID must be a valid number.",
            "number.integer": "Patient ID must be an integer."
        }),
    appointment_date: Joi.date()
        .iso()
        .required()
        .messages({
            "any.required": "Appointment date is required.",
            "date.base": "Appointment date must be a valid date.",
            "date.format": "Appointment date must be in ISO format (YYYY-MM-DD)."
        }),
    appointment_session: Joi.string()
        .valid("Morning", "Afternoon", "Evening")
        .required()
        .messages({
            "any.required": "Appointment session is required.",
            "any.only": "Appointment session must be 'Morning', 'Afternoon', or 'Evening'."
        }),
    startTime: Joi.string()
        .pattern(/^([0-9]{1,2}):([0-9]{2}) (am|pm)$/i)
        .required()
        .messages({
            "any.required": "Start time is required.",
            "string.pattern.base": "Start time must be in 'hh:mm am/pm' format."
        }),
    endTime: Joi.string()
        .pattern(/^([0-9]{1,2}):([0-9]{2}) (am|pm)$/i)
        .required()
        .messages({
            "any.required": "End time is required.",
            "string.pattern.base": "End time must be in 'hh:mm am/pm' format."
        })
});

export default appointmentBookingSchema;
