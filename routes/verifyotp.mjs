import express from 'express';
import { user_getId } from '../models/db_functions.mjs';
import otpSchema  from '../schema/otpSchema.mjs';
import { otpValidation } from '../validation/Schemavalidation_fun.mjs';
import { user_otpselect } from '../models/db_functions.mjs'
import { user_updateVerify } from '../models/db_functions.mjs'
import { user_updateAttempts } from '../models/db_functions.mjs'

const router = express.Router();

router.post("/", async (req, res) => {
    console.log("API called and request received");
    console.log("Received Data:", req.body);

    let attempts;
    let statuscode = 400;
    let message = "Error occurred";
    let resetTime=10

    try {
        const { email, otp } = req.body;
        console.log(otp);
        
        await otpValidation(otpSchema,req.body)

        const otpRecord = await user_otpselect([email]);
        console.log("User_otp_details", otpRecord);

        if (otpRecord.rowCount === 0) throw new Error("Email not found");

        const otpExpiryTime = otpRecord.rows[0].otp_expiry_time;
        let otpSentTime = otpRecord.rows[0].otp_attempt_time;  
        attempts = otpRecord.rows[0].attempts;
        console.log(otpSentTime);
        
        const queryresult=await user_getId([email])
        console.log(queryresult);

        if (queryresult.rows[0].verified === true)   throw new Error("User Already verified,Please check the email");

        if (otpExpiryTime < Date.now())   throw new Error("OTP expired. Please request a new OTP");

        if (attempts >= 3) {
            const timeDifference = (Date.now() - otpSentTime)/1000;  // give value millisecond 
             console.log(timeDifference);
             
            if (timeDifference < resetTime) {
                const remainingTime = Math.round(timeDifference);
                throw new Error(`Too many attempts, please wait for${resetTime} seconds : ${remainingTime} seconds`);
            } else {
                console.log("Restart you attempts");
                await user_updateAttempts([0, null,email]); 
                attempts=0
            }
        }

        if (otp !== otpRecord.rows[0].otp) {
            attempts++; 
            console.log(attempts);
            
            if (attempts === 3) {
                otpSentTime = new Date(new Date().getTime());
            }
            await user_updateAttempts([attempts, otpSentTime, email]); 
            throw new Error("Invalid OTP");
        }

        const updateresult=await user_updateVerify([email])
        console.log(updateresult);

        await user_updateAttempts([0, null, email]);

        statuscode = 200;
        message = "OTP verified successfully.";

    } catch (error) {
        console.log("Error occurred:", error);
        message = error.message;
    } finally {
        res.status(statuscode).json({ message: message });
    }
});

export default router;
