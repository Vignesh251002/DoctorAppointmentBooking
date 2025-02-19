import Joi from 'joi';

const removeAvailabilitySchema = Joi.object({
    doctor_id: Joi.number().integer().positive().required(),
    availability_id: Joi.string().uuid().required()
});

export default removeAvailabilitySchema;
