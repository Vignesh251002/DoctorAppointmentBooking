import express from 'express';
import otpGenerator from 'otp-generator';
import mailing from '../nodemailer/nodemailer.mjs';
import { user_otpselect_query, user_otp_query, user_updateAttempts_query } from '../database/db_function.mjs';

const router = express.Router();

router.post("/", async (req, res) => {
    console.log("Resend OTP API called");
    console.log("Received Data:", req.body);

    let statuscode = 400;
    let message = "Error occurred";

    try {
        const { email } = req.body;
        
        
        const otpRecord = await user_otpselect_query([email]);

        if (otpRecord.rowCount === 0) throw new Error("Email not found");

        const attempts = otpRecord.rows[0].attempts;
        const lastAttemptTime = otpRecord.rows[0].last_attempt_time ? new Date(otpRecord.rows[0].last_attempt_time).getTime() : null;
        const currentTime = Date.now();

        if (attempts >= 3 && lastAttemptTime) {
            const timeDifference = (currentTime - lastAttemptTime) / 1000; 
            if (timeDifference < 30) {
                throw new Error(`Wait ${Math.ceil(30 - timeDifference)} seconds before requesting a new OTP.`);
            }
        }

        const generatedOtp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        const otpExpiresAt = new Date(new Date().getTime() + 5 * 60 * 1000); 
        console.log("Generated OTP:", generatedOtp);

        mailing(email, generatedOtp);

        await user_otp_query([generatedOtp, otpExpiresAt, email]);

        
        await user_updateAttempts_query([attempts, currentTime, email]); 

        statuscode = 200;
        message = "New OTP sent successfully.";

    } catch (error) {
        console.log("Error occurred:", error);
        message = error.message;
    } finally {
        res.status(statuscode).json({ message: message });
    }
});


