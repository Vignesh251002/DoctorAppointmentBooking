import Joi from 'joi'

const updatePatientSchema = Joi.object({
  patient_id: Joi.number()
    .integer()
    .required()
    .messages({
      "any.required": "Patient ID is required.",
      "number.base": "Patient ID must be a valid number.",
      "number.integer": "Patient ID must be an integer.",
      "number.positive": "Patient ID must be a positive number."
    }),
  first_name: Joi.string()
    .optional()
    .messages({
      "string.base": "First name must be a string."
    }),
  last_name: Joi.string()
    .optional()
    .messages({
      "string.base": "Last name must be a string."
    }),
  date_of_birth: Joi.date()
    .iso()
    .less("now") 
    .optional()
    .messages({
      "date.base": "Date of birth must be a valid date.",
      "date.iso": "Date of birth must be in ISO format (YYYY-MM-DD).",
      "date.less": "Date of birth cannot be in the future."
    }),
  gender: Joi.string()
    .valid('male', 'female', 'other')
    .required()
    .messages({
      "any.only": "Gender must be 'male', 'female', or 'other'."
    }),
  blood_group: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')
    .optional()
    .messages({
      "any.only": "Blood group must be a valid type (A+, A-, B+, B-, O+, O-, AB+, AB-)."
    }),
  location: Joi.string()
    .required()
    .messages({
      "string.base": "Location must be a string.",
    }),
  contact: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Contact number must be exactly 10 digits."
    }),
  address: Joi.string()
    .max(255)
    .required()
    .messages({
      "string.base": "Address must be a string.",
      "string.max": "Address must not exceed 255 characters."
    })
});
export default updatePatientSchema;
