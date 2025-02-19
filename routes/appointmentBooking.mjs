import express from 'express';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import pool from '../database/db_conncetion.mjs';
console.log("files are successfully imported");
import { verifytoken } from '../utils/authentication.mjs';
import appointmentBookingSchema from '../schema/appointmentBooking.mjs';
import { appointmentBookingValidation } from '../validation/Schemavalidation_fun.mjs';


const router = express.Router();


let statuscode=400;
let message;

function validateMinutesBasedOnInterval(time, intervalMinutes) {
const trimmedTime = time.trim(); 
const [timePart, period] = trimmedTime.split(" "); 
const [hours, minutes] = timePart.split(":").map(Number); 

console.log(hours,minutes,period);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return false; 
    }
    if (minutes % intervalMinutes !== 0) {
        return false; 
    }
    return true; 
}

router.post("/",verifytoken, async (req, res) => {
    try {

        console.log(req.user.email);
        await appointmentBookingValidation(appointmentBookingSchema,req.body)
        const { doctor_id, patient_id, appointment_date, appointment_session, startTime, endTime, } = req.body;
        console.log(req.body);
        
        if(patient_id!=req.user.userid){
            throw new Error("unauthorized access")
        }
        const id=uuidv4()
        
        console.log(startTime,endTime);

        const availabilityQuery = `SELECT start_time, end_time, slot_interval FROM doctor_availability WHERE doctor_id = $1 AND date = $2 AND session=$3`;
        const availabilityResult = await pool.query(availabilityQuery, [doctor_id, appointment_date,appointment_session]);
        console.log(availabilityResult);

        if(availabilityResult.rowCount===0){
            throw new Error("No slot availabile for the date and time you selected")
        }

        const formattedStart = moment(startTime, "hh:mm A").format("HH:mm:ss");
        const formattedEnd = moment(endTime, "hh:mm A").format("HH:mm:ss");
        console.log(formattedStart,formattedEnd);

        const {start_time,end_time,slot_interval} = availabilityResult.rows[0];
        console.log(start_time,end_time);
        
        
        if (!validateMinutesBasedOnInterval(startTime, slot_interval)) {
            throw new Error(`Invalid start time. Minutes must be a multiple of ${slot_interval}.`);
        }
        if (!validateMinutesBasedOnInterval(endTime, slot_interval)) {
            throw new Error(`Invalid end time. Minutes must be a multiple of ${slot_interval}.`);
        } 

        if (start_time > formattedStart || end_time < formattedEnd) {
            throw new Error("Choose the start and end timing from the doctor available time slot")
        }
        
        const bookingCheckQuery = `SELECT * FROM appointments WHERE doctor_id = $1 AND appointment_date = $2 AND start_time = $3 AND end_time = $4 and status='booked'`;
        const bookedSlot = await pool.query(bookingCheckQuery, [doctor_id, appointment_date, formattedStart, formattedEnd,]);
        console.log(bookedSlot);
        
        if (bookedSlot.rowCount > 0) {
            throw new Error("This time slot is already booked");
        }

        const insertQuery = `INSERT INTO appointments (id ,doctor_id, patient_id, appointment_date, appointment_session, start_time, end_time, status) VALUES ($1, $2, $3, $4, $5,$6,$7 ,'booked') RETURNING *`;
        const newAppointment = await pool.query(insertQuery, [id, doctor_id, patient_id, appointment_date,appointment_session, formattedStart, formattedEnd]);
        
        statuscode=200
        message="Appointment Successfully Booked"

    } catch (error) {
        console.error("Error occured",error);
        message=error.message
         
    }
    finally{
        res.status(statuscode).json({message:message})
    }
})

export default router

