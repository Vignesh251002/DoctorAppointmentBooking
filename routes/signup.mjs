import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import otpGenerator from 'otp-generator'
import mailing from '../nodemailer/nodemailer.mjs'
import { signupschema } from '../schema/signupschema.mjs'
import { signupValidation } from '../validation/Schemavalidation_fun.mjs'
import pool from '../database/db_conncetion.mjs'
import {users_signup,users_contact,user_otp} from '../models/db_functions.mjs'
import bcrypt from 'bcrypt';
console.log("Files imported successfully");

const router = express.Router();
console.log("Express application successfully created");

router.post('/', async (req, res) => {
    console.log("API called and request received");
    console.log("Received Data:", req.body);

    let statuscode = 400;
    let message = "Error occurred";
    try {  
        await signupValidation(signupschema, req.body);
        console.log("Validation successful");
        const { email,role, password} = req.body;

        const generatedOtp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        const otpExpiresAt = new Date(new Date().getTime() + 5 * 60 * 1000); 
        console.log("Generated OTP:", generatedOtp);
        
        const saltRounds = 5;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("Hashed value", hashedPassword);

        const authId = uuidv4();
        console.log("UUID generated", authId);

        await pool.query('BEGIN');

        const user_signup_result = await users_signup([authId, hashedPassword, role])
        console.log("User details inserted", user_signup_result.rows[0]);
        const userId = user_signup_result.rows[0].id; 
        
        const user_contact_result = await users_contact([userId,email])
        console.log("User details inserted", user_contact_result.rows[0]);

        const user_otp_result=await user_otp([userId,email,generatedOtp,otpExpiresAt])
        console.log("User details inserted", user_otp_result.rows[0]);

        await pool.query('COMMIT');

        const sendmail=mailing(generatedOtp,email)

        message = 'OTP sent successfully. Please verify your email to signin';
        statuscode = 201;

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error occurred:', error);
        if (error.code === '23505') {
            if (error.constraint === 'users_contact_email_key') 
                message = "Email already exists. Please use a different email"
        } 
        else if (error.message.startsWith("Validation Error:")) {
            message = error.message;
            statuscode = 400;
        } 
        else {
            message = "Internal Server Error"
            statuscode = 500;
        }
    } finally {
        res.status(statuscode).json({ message: message });
    }
});

export default router;
