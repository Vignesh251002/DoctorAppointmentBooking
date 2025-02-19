import express from 'express'
import pool from '../database/db_conncetion.mjs';
import { user_getId } from '../models/db_functions.mjs';
import { user_insertDoctor } from '../models/db_functions.mjs';
import { verifytoken } from '../utils/authentication.mjs';
import { user_updateDoctorContact } from '../models/db_functions.mjs';
import { user_selectdetails } from '../models/db_functions.mjs';
import { user_updateDoctor } from '../models/db_functions.mjs';
import updateDoctorSchema from '../schema/updateDoctorSchema.mjs';
import { updateDoctorValidation } from '../validation/Schemavalidation_fun.mjs';

const router = express.Router();

router.put("/", verifytoken, async (req, res) => {

let statuscode=400
let message    
    try {

        const {doctor_id, first_name, last_name,date_of_birth, gender,blood_group,specialization, experience, consultation_fee, location, contact,address } = req.body;

        await updateDoctorValidation(updateDoctorSchema,req.body)

        if(doctor_id!=req.user.userid){
            throw new Error("unauthorized access")
        }
        
        const selectresult=await user_selectdetails([doctor_id])
        console.log(selectresult);
        
        await pool.query('BEGIN')

        if(selectresult.rowCount===0){
            const insertresult1=await user_insertDoctor([doctor_id,first_name,last_name,date_of_birth,gender,blood_group,specialization,experience,consultation_fee])
            console.log(insertresult1);
        }
        
        if(selectresult.rowCount>0){
            const updateResult=await user_updateDoctor([first_name,last_name,date_of_birth,gender,blood_group,specialization,experience,consultation_fee,doctor_id])
            console.log(updateResult);  
        }
        
        const updateresult=await user_updateDoctorContact([contact,location,address,doctor_id])
        console.log(updateresult);
        
        await pool.query('COMMIT') 
        
        message="profile updated successfully"
        statuscode=200

    } catch (error) {
        await pool.query('ROLLBACK')
        console.log("Error occured:",error);
        if (error.code === '23505') {
            if (error.constraint === 'users_contact_contact_key') 
            message = "contact already exists. Please use a different contact"
        } 
        else{
            message=error.message
        }
    }
    finally{
        res.status(statuscode).json({message:message})
    }
});

export default router;
