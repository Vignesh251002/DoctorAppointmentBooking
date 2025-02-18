import express from 'express'
import pool from '../database/db_conncetion.mjs';
import { user_getId } from '../models/db_functions.mjs';
import { user_updatePatient } from '../models/db_functions.mjs';
import { user_updatePatientContact } from '../models/db_functions.mjs';
import { verifytoken } from '../utils/authentication.mjs';
console.log("files are successfully uploaded");

const router = express.Router();

router.put("/", verifytoken, async (req, res) => {

let statuscode=400
let message    
    try {
        const {patient_id,  first_name, last_name, date_of_birth, gender, blood_group, location, contact, address } = req.body;

        if (!patient_id && !first_name && !date_of_birth && !gender && !blood_group && !last_name && !location && !contact  && !address) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if(patient_id!=req.user.userid){
            throw new Error("unauthorized access")
        }

        await pool.query('BEGIN')

        const insertresult=await user_updatePatient([patient_id,first_name,last_name,date_of_birth,gender,blood_group])
        console.log(insertresult);

        const insertresult2=await user_updatePatientContact([contact,location,address,patient_id])
        console.log(insertresult2);

        await pool.query('COMMIT')
                   
        message="profile updated successfully"
        statuscode=200

    } catch (error) {
        await pool.query('ROLLBACK')
        console.log("Error occured:",error);
        if (error.code === '23505') {
            if (error.constraint === 'usersdetails_contact_key') 
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
