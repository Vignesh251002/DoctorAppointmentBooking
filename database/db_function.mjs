import pool from '../database/db_conncetion.mjs'  

const user_signup_query =  (insertvalues1)=>{
    const insertQuery = `INSERT INTO user_signup_details (authId, username, email, password)
                         VALUES ($1, $2, $3, $4) RETURNING *`; 
    return pool.query(insertQuery, insertvalues1)      
}

const user_additional_query = (insertvalues2)=>{
    const insertQuery = `INSERT INTO user_signup_additional_details (userId, contact, address)
            VALUES ($1, $2, $3) RETURNING *`;
    return pool.query(insertQuery, insertvalues2);
}      

const user_otp_query= (insertvalues3)=>{
    const otpinsertquery = "INSERT INTO user_otp_verification (userId,email,otp,otp_expiry_time) VALUES ($1,$2,$3,$4) RETURNING*";
    return pool.query(otpinsertquery,insertvalues3);
}

const user_otpselect_query=(insertvalues4)=>{
    const otpselectquery = "select * from user_otp_verification where email=$1"
    return pool.query(otpselectquery,insertvalues4)
}

const User_DetiailsSelect_Query=(insertvalues5)=>{
    const selectquery = "SELECT * FROM user_signup_details WHERE email=$1";
    return pool.query(selectquery, insertvalues5);
}

const User_UpdatePassword_Query=(updatevalues)=>{
    const updatequery='update user_signup_details set password=$1 where email=$2'
    return pool.query(updatequery,updatevalues)
}

const User_AddiDetailsSelect_Query=(insertvalues)=>{
    const selectquery ="select * from user_signup_additional_details where userid=$1";
    return pool.query(selectquery, insertvalues);
}

const user_updateVerify_query=(updateValues)=>{
    const updatequery="update user_signup_details set verified=true where email=$1";
    return pool.query(updatequery,updateValues)
}

const user_updateAttempts_query=(updateValues)=>{
    const updatequery="update user_otp_verification set attempts=$1 ,otp_sent_time=$2 where email=$3";
    return pool.query(updatequery,updateValues)
}

export {user_signup_query,  user_additional_query,  user_otp_query,  user_otpselect_query,  User_DetiailsSelect_Query, User_UpdatePassword_Query,User_AddiDetailsSelect_Query, user_updateVerify_query, user_updateAttempts_query}