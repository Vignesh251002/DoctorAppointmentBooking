import express from "express";
import { user_getId } from "../models/db_functions.mjs";
import { v4 as uuidv4 } from "uuid";
import { addAvailability } from "../models/db_functions.mjs";
import { verifytoken } from "../utils/authentication.mjs";


const router = express.Router();
router.post("/",verifytoken,  async (req, res) => {

let message
let statuscode=400 
let data 
  try {
    const { doctor_id, date, session, start_time, end_time, slot_interval } = req.body;

    console.log(req.user);

    if(req.user.userid!=doctor_id)
    throw new Error("Unauthorized Access")

    if(new Date(date)<Date.now()){
    throw new Error("Invalid date. Don't enter the past date")
    }
    
    const availabilityId = uuidv4();

    const addvalues = [ doctor_id,availabilityId, date, session, start_time, end_time, slot_interval];
    const availabilityResult=await addAvailability(addvalues)
    console.log(availabilityResult);
    
    statuscode=200
    message="Availability added successfully"
    data=availabilityResult.rows[0]
    
    
  } catch (error) {
    if(error.code === '23505'){
      if(error.constraint==='unique_doctor_availability'){
        message="Availability Already added"
      }
    }
    else{
      console.log("Error occured",error);
      message=error.message
    }
  }
  finally{
    res.status(statuscode).json({message:message,data:data})
  }
});

export default router;
