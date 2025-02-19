import express from "express";
import pool from "../database/db_conncetion.mjs";
import { verifytoken } from "../utils/authentication.mjs";

const router = express.Router();

router.get("/", verifytoken, async (req, res) => {
  let statuscode = 400;
  let message = "";
  let profileData;
  let contactData;

  try {
    const {patient_id,doctor_id}=req.body
    if(req.user.userid!=patient_id){
        throw new Error("Unathorized Access")
    }

    const doctorResult = await pool.query(
      "SELECT first_name, last_name, date_of_birth, gender, blood_group, specialization, experience, consultation_fee FROM usersdetails WHERE user_id = $1",[doctor_id]
    );

    const contactResult = await pool.query("select contact,location,address from users_contact where userid=$1",[doctor_id])
     contactData=contactResult.rows[0]
    
    if (doctorResult.rowCount === 0) {
      throw new Error("Doctor profile not found")
    }

    profileData = doctorResult.rows[0];
    statuscode = 200;
    message = "Doctor profile fetched successfully";
  } catch (error) {
    console.log("Error occurred:", error);
    message = error.message;
  } finally {
    res.status(statuscode).json({
      message: message,
      doctorProfile: {...profileData,...contactData}
    });
  }
});

export default router;
