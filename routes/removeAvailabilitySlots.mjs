import express from "express";
import pool from "../database/db_conncetion.mjs";

const router = express.Router();

router.delete("/", async (req, res) => {
let statuscode=400
let message
let data

    try {
        const {availability_id}=req.body
        const checkAvailability = await pool.query("SELECT * FROM doctor_availability WHERE id = $1",  [availability_id]);

        if (checkAvailability.rowCount === 0) {
            throw new Error("Availability slot not found")
        }

        const deleteAvailability = await pool.query("DELETE FROM doctor_availability WHERE id = $1 RETURNING *", [availability_id]);

        if (deleteAvailability.rowCount > 0) {
           message="Availability deleted successfully"
           data=deleteAvailability.rows[0]
        } 
    }   catch (error) {
        console.error("Error occured", error);
        message=error.message
    }
    finally{
        res.status(statuscode).json({message:message,deleted_data:data})
    }
});


export default router;
