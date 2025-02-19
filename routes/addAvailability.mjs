import express from "express";
import { addAvailability } from "../models/db_functions.mjs";
import { v4 as uuidv4 } from "uuid";
import { verifytoken } from "../utils/authentication.mjs";
import { addAvailabilityValidation } from "../validation/Schemavalidation_fun.mjs";
import addAvailabilitySchema from "../schema/addAvailabilitySchema.mjs";

const router = express.Router();

router.post("/", verifytoken, async (req, res) => {
  let message = "An error occurred";
  let statuscode = 500;
  let data = null;

  try {
    const { doctor_id, date, session, start_time, end_time, slot_interval } = req.body;

    console.log(req.user);
    await addAvailabilityValidation(addAvailabilitySchema, req.body);
    console.log("Validation successful");

    if (req.user.userid !== doctor_id) {
      throw new Error("Unauthorized Access");
    }

    if (new Date(date).getTime() < new Date().getTime()) {
      throw new Error("Invalid date. Don't enter a past date or today's date to add availability");
    }

    const convertTo24HourFormat = (time12h) => {
      const [time, period] = time12h.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (period.toLowerCase() === "pm" && hours !== 12) {
        hours += 12;
      } else if (period.toLowerCase() === "am" && hours === 12) {
        hours = 0;
      }
      return hours * 60 + minutes;
    };

    const startMinutes = convertTo24HourFormat(start_time.trim());
    const endMinutes = convertTo24HourFormat(end_time.trim());

    if (session.toLowerCase() === "morning" && (startMinutes < 300 || startMinutes >= 720)) {
      throw new Error("Invalid time range for morning session. Must be before 11:59 AM");
    }

    if (session.toLowerCase() === "evening" && (startMinutes < 840 || startMinutes >= 1439)) {
      throw new Error("Invalid time range for evening session. Must be after 2:00 PM");
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