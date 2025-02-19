import Joi from "joi";

const updateDoctorSchema = Joi.object({
    doctor_id: Joi.number()
        .integer()
        .required()
        .messages({
            "any.required": "Doctor ID is required.",
            "number.base": "Doctor ID must be a valid number.",
            "number.integer": "Doctor ID must be an integer."
        }),
    first_name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "any.required": "First name is required.",
            "string.base": "First name must be a valid string.",
            "string.min": "First name must be at least 2 characters long.",
            "string.max": "First name must not exceed 50 characters."
        }),
    last_name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "any.required": "Last name is required.",
            "string.base": "Last name must be a valid string.",
            "string.min": "Last name must be at least 2 characters long.",
            "string.max": "Last name must not exceed 50 characters."
        }),
    date_of_birth: Joi.date()
        .less("now")
        .required()
        .messages({
            "any.required": "Date of birth is required.",
            "date.base": "Date of birth must be a valid date.",
            "date.iso": "Date of birth must be in this format (YYYY-MM-DD).",
            "date.less": "Date of birth must be in the past."
        }),
    gender: Joi.string()
        .required()
        .messages({
            "any.required": "Gender is required.",
            "any.only": "Gender must be 'male', 'female', or 'other'."
        }),
    blood_group: Joi.string()
        .valid("A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-")
        .required()
        .messages({
            "any.required": "Blood group is required.",
            "any.only": "Blood group must be a valid type (A+, A-, B+, B-, O+, O-, AB+, AB-)."
        }),
    specialization: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            "any.required": "Specialization is required.",
            "string.base": "Specialization must be a valid string.",
            "string.min": "Specialization must be at least 3 characters long.",
            "string.max": "Specialization must not exceed 100 characters."
        }),
    experience: Joi.number()
        .integer()
        .min(0)
        .max(100)
        .required()
        .messages({
            "any.required": "Experience is required.",
            "number.base": "Experience must be a valid number.",
            "number.integer": "Experience must be an integer.",
            "number.min": "Experience cannot be negative.",
            "number.max": "Experience cannot exceed 100 years."
        }),
    consultation_fee: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            "any.required": "Consultation fee is required.",
            "number.base": "Consultation fee must be a valid number.",
            "number.integer": "Consultation fee must be an integer.",
            "number.min": "Consultation fee cannot be negative."
        }),
    location: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            "any.required": "Location is required.",
            "string.base": "Location must be a valid string.",
            "string.min": "Location must be at least 3 characters long.",
            "string.max": "Location must not exceed 100 characters."
        }),
    contact: Joi.string()
        .pattern(/^\d{10}$/)
        .required()
        .messages({
            "any.required": "Contact number is required.",
            "string.pattern.base": "Contact number must be exactly 10 digits."
        }),
    address: Joi.string()
        .min(15)
        .max(255)
        .required()
        .messages({
            "any.required": "Address is required.",
            "string.base": "Address must be a valid string.",
            "string.min": "Address must be at least 15 characters long.",
            "string.max": "Address must not exceed 255 characters."
        })
});

export default updateDoctorSchema;
