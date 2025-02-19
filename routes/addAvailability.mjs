import express from "express";
import { addAvailability } from "../models/db_functions.mjs";
import { v4 as uuidv4 } from "uuid";
import { verifytoken } from "../utils/authentication.mjs";

const router = express.Router();

router.post("/", verifytoken, async (req, res) => {
  let message = "An error occurred";
  let statuscode = 500;
  let data = null;

  try {
    const { doctor_id, date, session, start_time, end_time, slot_interval } = req.body;

    console.log(req.user);

    if (req.user.userid !== doctor_id) {
      throw new Error("Unauthorized Access");
    }

    if(new Date(date)<Date.now()){
      throw new Error("Invalid date. Don't enter the past date")
      }

    // Normalize date to ignore time when comparing
    // const inputDate = new Date(date);
    // const today = new Date();
    // today.setHours(0, 0, 0, 0);
    // inputDate.setHours(0, 0, 0, 0);

    // if (inputDate < today) {
    //   throw new Error("Invalid date. Don't enter a past date");
    // }

    const trimmedTime1 = start_time.trim(); 
    const [starttimePart, startperiod] = trimmedTime1.split(" "); 
    console.log(starttimePart)
    if (session.toLowerCase() === "morning") {
      if ( starttimePart>"11:59 am") {
          throw new Error("Invalid time range for morning session. Must be in before 12:00 pm");
      }
    }

    const trimmedTime2 = start_time.trim(); 
    const [endtimePart, endperiod] = trimmedTime2.split(" "); 

    if (session.toLowerCase() === "evening") {
      if ( endtimePart<"02:00 pm") {
          throw new Error("Invalid time range for evening session. Must be in after 02:00 pm");
      }
    }

    const availabilityId = uuidv4();
    const addvalues = [doctor_id, availabilityId, date, session, start_time, end_time, slot_interval];
    
    const availabilityResult = await addAvailability(addvalues);
    console.log(availabilityResult);

    statuscode = 200;
    message = "Availability added successfully";
    data = availabilityResult.rows[0];

  } catch (error) {
    if (error.code === '23505' && error.constraint === 'unique_doctor_availability') {
      message = "Availability Already added";
      statuscode = 400;
    } else {
      console.log("Error occurred:", error);
      message = error.message;
      statuscode = 500;
    }
  } finally {
    res.status(statuscode).json({ message, data });
  }
});

export default router;
