import Joi from 'joi';
const updateAvailabilitySchema = Joi.object({
  availability_id: Joi.string().uuid().required(),
  doctor_id: Joi.number().integer().positive().required(),
  date: Joi.date().iso().required(),
  session: Joi.string().required(),
  start_time: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/) 
    .required(),
  end_time: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required(),
  slot_interval: Joi.number().integer().min(5).max(120).required()
});

export default updateAvailabilitySchema;
