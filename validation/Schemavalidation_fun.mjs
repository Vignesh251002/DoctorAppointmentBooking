import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const signupValidation = (schema, payload) => {
    const { error, value } = schema.validate(payload);
    if (error) {
        throw new Error(`Validation Error: ${error.details[0].message}`);
    }
    return value;
};

const changePasswordValidation = (schema, payload) => {
    const { error, value } = schema.validate(payload);
    if (error) {
        throw new Error(`Validation Error: ${error.details[0].message}`);
    }
    return value;
};

const otpValidation = (schema,payload)=>{
    const {error, value}=schema.validate(payload)
    if (error) {
        throw new Error(`Validation Error: ${error.details[0].message}`);
    }
    return value;
};

const addAvailabilityValidation=(schema,payload)=>{
    const {error,value}=schema.validate(payload)
    if(error){
        throw new Error(`Validation Error: ${error.details[0].message}`)
    }
    return value;
}


const appointmentBookingValidation=(schema,payload)=>{
    const {error,value}=schema.validate(payload)
    if(error){
        throw new Error(`Validation Error: ${error.details[0].message}`)
    }
    return value;
}


const slotAvailabilityValidation=(schema,payload)=>{
    const {error,value}=schema.validate(payload)
    if(error){
        throw new Error(`Validation Error: ${error.details[0].message}`)
    }
    return value;
}

const updateDoctorValidation=(schema,payload)=>{
    const {error,value}=schema.validate(payload)
    if(error){
        throw new Error(`Validation Error: ${error.details[0].message}`)
    }
    return value;
}

const updatePatientValidation=(schema,payload)=>{
    const {error,value}=schema.validate(payload)
    if(error){
        throw new Error(`Validation Error: ${error.details[0].message}`)
    }
    return value;
}

const updateAvailabilityValidation=(schema,payload)=>{
    const {error,value}=schema.validate(payload)
    if(error){
        throw new Error(`Validation Error: ${error.details[0].message}`)
    }
    return value;
}

const removeAvailabilityValidation=(schema,payload)=>{
    const {error,value}=schema.validate(payload)
    if(error){
        throw new Error(`Validation Error: ${error.details[0].message}`)
    }
    return value;
}


export { signupValidation, changePasswordValidation, otpValidation,addAvailabilityValidation,
         appointmentBookingValidation,slotAvailabilityValidation,updateDoctorValidation,
         updatePatientValidation,updateAvailabilityValidation,removeAvailabilityValidation };


