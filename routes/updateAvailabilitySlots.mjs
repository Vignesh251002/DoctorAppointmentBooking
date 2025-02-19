import express from "express";
import pool from "../database/db_conncetion.mjs";
import { user_updateAvailability } from "../models/db_functions.mjs";
import { verifytoken } from "../utils/authentication.mjs";
import { updateAvailabilityValidation } from "../validation/Schemavalidation_fun.mjs";
import updateAvailabilitySchema from "../schema/updateAvailabilitySchema.mjs";

const router = express.Router();

router.put("/",verifytoken, async (req, res) => {
let statuscode=400
let message   
let data 
    const {availability_id, doctor_id, date, session , start_time, end_time, slot_interval } = req.body;
    try { 

        if(req.user.userid!=doctor_id){
            throw new Error("Unathorized Access")
        }
        updateAvailabilityValidation(updateAvailabilitySchema,req.body)
        const checkAvailability = await pool.query( "SELECT * FROM doctor_availability WHERE id = $1",  [availability_id]);
        if (checkAvailability.rowCount === 0) {
            throw new Error("Availability Slot not found")
        }

        const updatedAvailability = await pool.query("UPDATE doctor_availability SET doctor_id = $1, date = $2,session=$3, start_time = $4, end_time = $5, slot_interval = $6 WHERE id = $7 RETURNING *", 
            [doctor_id, date,session, start_time, end_time, slot_interval,availability_id]
        );
        if (updatedAvailability.rowCount > 0) {
           statuscode=200
           message="Availability slot updated successfully"
           data=updatedAvailability.rows[0]
        } else {
            message="Updation failed.please try again"
        }
    } catch (error) {
        console.error("Error occured while updating", error);
        message=error.message
    }
    finally{
        res.status(statuscode).json({message:message,updated_data:data})
    }
});

export default router;
