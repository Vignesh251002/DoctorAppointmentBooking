import express from "express";
import bcrypt from "bcrypt";
import { generatetoken } from '../utils/authentication.mjs'
import { user_detailsSelect } from "../models/db_functions.mjs"
import dotenv from 'dotenv'
console.log("Files imported successfully");

dotenv.config()
const router = express.Router();
console.log("Route successfully created");

router.post("/", async (req, res) => {
  console.log("API called and login request received");
  console.log("Received Data:", req.body);

  let statuscode = 400;
  let message = "Error occurred";
  let token

  try {
    const { email , password } = req.body;
    const selectresult=await user_detailsSelect([email])
    console.log("Row Count:", selectresult);
    console.log(selectresult.rows[0].password);
    
    
    if (selectresult.rowCount === 0) throw new Error("User does not exist");

    if(selectresult.rows[0].verified===false)
    throw new Error("User not verified.Please verify your mail id")

    const decodedpassword = selectresult.rows[0].password;
    if (!decodedpassword) throw new Error("Password not found for user");
    
    console.log("Entered Password:", password);
    console.log("Stored Hashed Password:", decodedpassword);
    
    const isMatch = await bcrypt.compare(password, decodedpassword);
    if (!isMatch) throw new Error("Invalid password");

    console.log(process.env.SECRET_KEY);

    const userid=selectresult.rows[0].id
    console.log(userid)

    token = await generatetoken(userid,email);
    console.log("Generated Token:", token);  
    
    statuscode = 200;
    message = "Login successful";

  } catch (error) {
    console.log("Error occurred:", error.message);
    message = error.message;
  } finally {
    res.status(statuscode).json({ message, token});
  }
});
export default router;
