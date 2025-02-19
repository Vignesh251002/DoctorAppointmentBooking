import express from 'express';
import moment from 'moment';
import pool from '../database/db_conncetion.mjs';
import { verifytoken } from '../utils/authentication.mjs';

const router = express.Router();

router.get("/",verifytoken, async (req, res) => {
    try {
        const { patient_id,doctor_id, date,session } = req.body;
        console.log(req.body);
        
        console.log(req.user);

        if(req.user.userid!=patient_id){
            throw new Error("Unathorized Access")
        }
        
        if (new Date(date)<= new Date()) {
            throw new Error("Invalid date. Don't enter a past date");
        }

        const insertquery = `SELECT start_time, end_time,slot_interval FROM doctor_availability WHERE doctor_id = $1 AND date = $2 AND session=$3`;
        const doctorAvailability = await pool.query(insertquery, [doctor_id, date,session]);
        console.log(doctorAvailability);

        if (doctorAvailability.rowCount === 0) {
            return res.status(404).json({ message: "No slot available on the selected date and session" });
        }
        const { start_time, end_time, slot_interval } = doctorAvailability.rows[0];

        const allSlots = generateTimeSlots(start_time, end_time, slot_interval );
        console.log(allSlots);
        

        const selectquery = `SELECT start_time, end_time, status FROM appointments WHERE doctor_id = $1 AND appointment_date = $2`;
        const bookedSlots = await pool.query(selectquery, [doctor_id, date]);
        console.log(bookedSlots);

        const bookedTimes = bookedSlots.rows.map(slot => ({
            start: moment(slot.start_time, "hh:mm:ss a").format("hh:mm a"),
            end: moment(slot.end_time, "hh:mm:ss a").format("hh:mm a"),
            status: slot.status
        }));
        console.log(bookedTimes);

        const slotsWithStatus = allSlots.map(slot => {
            const matchingSlot = bookedTimes.find(booked => 
                moment(slot.start_time, "hh:mm A").format("HH:mm a") === moment(booked.start, "HH:mm a").format("HH:mm a") &&
                moment(slot.end_time, "hh:mm A").format("HH:mm a") === moment(booked.end, "HH:mm a").format("HH:mm a") && booked.status=='booked'
            );
            return {
                ...slot,
                status: matchingSlot ? matchingSlot.status : "available"
            };
        });
        
        return res.json({ slotsWithStatus });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message});
    }
});

function generateTimeSlots(startTime, endTime, interval) {
    let slots = [];
    let current = moment(startTime, ["hh:mm:ss A"]);
    let end = moment(endTime, ["hh:mm:ss A"]);

    if (end<current) 
         end.add(1, "days"); 
    while (current<end) {
        let next = moment(current).add(interval, "minutes");
        if (next > end) 
            break; 
        slots.push({
            start_time: current.format("hh:mm A"),
            end_time: next.format("hh:mm A"),
        });
        current = next;
    }
    return slots;
}

export default router