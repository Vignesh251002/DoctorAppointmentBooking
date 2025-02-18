import express from 'express';
import pool from '../database/db_conncetion.mjs';
import { verifytoken } from '../utils/authentication.mjs';
import { user_getId } from '../models/db_functions.mjs';
import { user_cancelAppoint } from '../models/db_functions.mjs';
import { user_getAppoint } from '../models/db_functions.mjs';
import { user_updateAppoint } from '../models/db_functions.mjs';

const router = express.Router();

router.delete('/',verifytoken,async (req, res) => {

  let statuscode=400
  let message
try{    
    const {appointment_id,patient_id, doctor_id, cancel_reason}=req.body
    const email=req.user.email
    console.log(email);
    
     

    if(req.user.userid!=patient_id){
      throw new Error("Unathorized Access")
    }

    const appointment_details=await user_getAppoint([appointment_id,patient_id,doctor_id])
    console.log(appointment_details);
    
    if (appointment_details.rowCount === 0) {
      throw new Error("There is no appointment scheduled to the mentioned details")
    }

    if(appointment_details.rows[0].status==='canceled'){
      throw new Error("Appointment already canceled")
    }

    pool.query('BEGIN')

    const insertresult=await user_cancelAppoint([appointment_id,patient_id,doctor_id,cancel_reason])
    console.log("Record Inserted",insertresult);
    
    const updateresult=await user_updateAppoint([appointment_id])
    console.log("Record deleted",updateresult);
    
    pool.query('COMMIT')
    
    statuscode=200
    message="Appointment canceled successfully"
  }
  catch(error){
    pool.query('ROLLBACK')
    console.log("Error occured",error)
    message=error.message
  }
  finally{
    res.status(statuscode).json({message:message})
  }
  });


export default router
